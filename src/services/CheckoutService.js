import { Category } from "@/models/Category";
import { v4 as uuidv4 } from 'uuid';
import { MenuItem } from "@/models/MenuItem";
import { Company } from "@/models/Company";
import { userAuth } from "@/app/api/auth/[...nextauth]/route";

const { Checkout } = require("@/models/Checkout");

export default class CheckoutService {
  constructor() {
    this.dbCheckout = Checkout;
    this.uuid = uuidv4();
  }

  async create({ address, cartProducts: menuItems}) {
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
      subtotal += this.cartProductPrice(menuItem);
    }

    const company = await Company.get(companyId);
    if (!company) {
      throw new Error('Empresa não encontrada');
    }
    const delivery = company?.delivery || 0;
    const user = await userAuth();
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
      status: 'pending',
      menuItems,
    }
    return await Checkout.create(checkout);
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

    return await Checkout.scan(search).exec();
  }

  cartProductPrice(cartProduct) {
    let price = cartProduct.basePrice;
    if (cartProduct.size) {
      price += cartProduct.size.price;
    }
    if (cartProduct.extras?.length > 0) {
      for (const extra of cartProduct.extras) {
        price += extra.price;
      }
    }
    return price;
  }
}