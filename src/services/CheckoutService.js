import { Category } from "@/models/Category";
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from "@/models/MenuItem";
import { Company } from "@/models/Company";
import { userAuth } from "@/app/api/auth/[...nextauth]/route";
import { gzappy } from "@/libs/gzappy";
import { formatFromMoney } from "@/libs/formatInput";

const { Checkout } = require("@/models/Checkout");

export default class CheckoutService {
  constructor() {
    this.dbCheckout = Checkout;
    this.uuid = uuidv4();
  }

  async create({ address, cartProducts: menuItems, deliveryDetails}) {
    let subtotal = 0;
    let companyId = null

    if (!address?.city) {
      throw new Error('Cidade não informada');
    }
    if (!address?.streetAddress) {
      throw new Error('Endereço não informado');
    }
    if (!address?.neighborhood) {
      throw new Error('Bairro não informado');
    }
    if (!address?.number) {
      throw new Error('Número não informado');
    }
    if (!address?.phone) {
      throw new Error('Telefone não informado');
    }
    for (const cartProduct of menuItems) {
      if (!companyId) {
        companyId = cartProduct.company_id;
      }
      
      const category = await Category.get(cartProduct?.category_id);
      if (!category) {
        throw new Error('O produto não tem uma empresa associada');
      }

      const menuItem = await MenuItem.get(cartProduct?.id);
      if (!menuItem) {
        throw new Error('O produto não tem um item de menu associado');
      }
      subtotal += this.cartProductPrice(cartProduct);
      delete cartProduct.size;
    }

    const company = await Company.get(companyId);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }
    let delivery = 0;
    if (deliveryDetails?.delivery === 'delivery') {
      delivery = company?.delivery || 0;
    }
    const user = await userAuth();
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
    const checkout = {
      ...address,
      client: user?.name,
      user_id: user?.id,
      id: this.uuid,
      company_id: companyId,
      company_name: company?.name,
      subtotal,
      delivery,
      total: subtotal + delivery,
      status: 'Preparando',
      menuItems,
      deliveryDetails
    };

    const result = await Checkout.create(checkout);

    await Company.update({
      id: company?.id,
      numberOfOrders: parseInt(company?.numberOfOrders || 0) + 1
    });
    
    if(result && company?.phone) {
      const deliveryMess = checkout?.deliveryDetails?.delivery === 'delivery' ? 'Entregar' : 'Cliente retira';
      const changeFor = checkout?.deliveryDetails?.changeFor ? `Troco para R$ ${checkout?.deliveryDetails?.changeFor}` : 'Sem troco';
      const paymentMethod = checkout?.deliveryDetails?.paymentMethod === 'card' ? 'Cartão' : `Dinheiro - ${changeFor}`
      const order = checkout?.menuItems.map((item) => {
        const extras = item?.extras?.map((extra) => {
          return `${extra?.name} - ${formatFromMoney(extra?.price)}`
        });
        const sizes = item?.sizes?.map((size) => {
          return `${size?.name} - ${formatFromMoney(size?.price)}`
        });
        const flavors = item?.flavorsPrices?.map((flavor) => {
          return `${flavor?.name} - ${formatFromMoney(flavor?.discount)}`
        });
        let text = '';
        if (extras?.length > 0) {
          text += extras.join(', ');
        }
        if (sizes?.length > 0) {
          text += sizes.join(', ');
        }
        if (flavors?.length > 0) {
          text += flavors.join(', ');
        }
        return `${text}`
      });
      
      const message = [
        `Novo pedido de ${user?.name} no valor de ${formatFromMoney(checkout?.total)}`,
        `Endereço: ${checkout?.streetAddress}, ${checkout?.number}, ${checkout?.neighborhood}`,
        `Telefone: ${checkout?.phone}`,
        `Detalhes da entrega: ${deliveryMess} - Pagamento em ${paymentMethod}`,
        `Pedido:`,
        `${order?.join(', ')}`,
        `Total: ${formatFromMoney(checkout?.total)}`
      ];
      await gzappy({
        phone: company?.phone,
        message
      });
      const messageForUser = [
        `${user?.name}, seu pedido foi realizado com sucesso.`,
        `Total: ${formatFromMoney(checkout?.total)}`,
        `Acompanhe o status do seu pedido em: https://www.foodnoow.com.br/`
      ];
      await gzappy({
        phone: checkout?.phone,
        message: messageForUser
      });
    }
    return result;
  }

  async update({id, status}) {
    const checkout = await Checkout.get(id);
    if (!checkout) {
      throw new Error('Pedido não encontrado');
    }
    const allStatus = [
      {id: 1, name: 'Preparando'},
      {id: 2, name: 'A caminho'},
      {id: 3, name: 'Entregue'},
      {id: 4, name: 'Cancelado'}
    ];
    const statusFound = allStatus.find(s => s.id == status);
    if (!statusFound) {
      throw new Error('Status não encontrado');
    }
    checkout.status = statusFound.name;
    delete checkout.createdAt;
    delete checkout.updatedAt;
    const result = await Checkout.update(checkout);

    let message = []
    if (statusFound.id === 1) {
      message = [
        `${checkout?.company_name}`,
        `${checkout?.client}, estamos ${statusFound.name} seu pedido.`,
      ]
    }
    if (statusFound.id === 2) {
      message = [
        `${checkout?.company_name}`,
        `${checkout?.client}, seu pedido está ${statusFound.name}.`,
      ]
    }
    if (statusFound.id === 3) {
      message = [
        `${checkout?.company_name}`,
        `${checkout?.client}, seu pedido foi ${statusFound.name}.`,
      ]
    }
    if (statusFound.id === 4) {
      message = [
        `${checkout?.company_name}`,
        `${checkout?.client}, seu pedido foi ${statusFound.name}.`,
      ]
    }

    await gzappy({
      phone: checkout?.phone,
      message
    });

    return result;
  }

  async find({id, userEmail, company_id}) {
    let search = {}
    if (id) {
      search.id = { eq: id };
    }
    if (userEmail) {
      search.userEmail = { eq: userEmail };
    }
    if (company_id) {
      search.company_id = { eq: company_id };
    }
    const result = await Checkout.scan(search).exec();
    if (result && result.length > 0) {
      return result[0];
    }
    return null;
  }

  async findAll({id, user_id, company_id}) {
    let search = {}
    if (id) {
      search.id = { eq: id };
    }
    if (user_id) {
      search.user_id = { eq: user_id };
    }
    if (company_id) {
      search.company_id = { eq: company_id };
    }

    const checkouts = await Checkout.scan(search).exec();
    return checkouts.sort((a, b) => {
      return new Date(a.createdAt) - new Date(b.createdAt);
    });
  }

  cartProductPrice(cartProduct) {
    let price = cartProduct.basePrice;
    if (cartProduct?.size) {
      price += cartProduct.size.price;
    }
    if (cartProduct?.extras?.length > 0) {
      for (const extra of cartProduct.extras) {
        price += extra.price;
      }
    }
    if (cartProduct?.flavorsPrices?.length > 0) {
      for (const flavor of cartProduct.flavorsPrices) {
        if (flavor?.discount) {
          price += flavor.discount;
        } else if (flavor?.price) {
          price += flavor?.price;
        }
      }
    }
    return price;
  }
}