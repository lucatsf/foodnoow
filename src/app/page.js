import Hero from "@/components/layout/Hero";
import HomeMenu from "@/components/layout/HomeMenu";
import SectionHeaders from "@/components/layout/SectionHeaders";

export default function Home() {
  return (
    <>
      <Hero />
      <HomeMenu />
      <section className="text-center my-16" id="about">
        <SectionHeaders
          subHeader={'Nossa história'}
          mainHeader={'Sobre nós'}
        />
        <div className="text-gray-500 max-w-md mx-auto mt-4 flex flex-col gap-4 items-center">
          <p className="text-center text-justify">
            Nossa jornada começou com a paixão pela gastronomia e o desejo de conectar pessoas aos sabores do mundo.
          </p>
          <p className="text-center text-justify">
            Somos mais que um serviço de entrega, somos uma comunidade de amantes da comida. Uma comunidade que cresce a cada dia,
            alimentada pela confiança de nossos usuários e pelo comprometimento inabalável com a qualidade.
            Junte-se a nós nesta jornada de descoberta e sabor.
          </p>
          <p className="text-center text-justify">
            Porque em cada prato que entregamos, há uma história para contar, uma cultura para explorar e um novo mundo a saborear.
          </p>
        </div>
      </section>
      <section className="text-center my-8" id="contact">
        <SectionHeaders
          subHeader={'Não hesite em nos contatar'}
          mainHeader={'Contato'}
        />
        <div className="mt-8">
          <a className="text-4xl underline text-gray-500" href="tel:+46738123123">
            (47) 99142-7087
          </a>
        </div>
      </section>
    </>
  )
}
