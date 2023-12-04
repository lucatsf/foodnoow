export default function SectionHeaders({subHeader,mainHeader}) {
  return (
    <>
      <h2 className="uppercase text-gray-600 font-bold leading-4">
        {subHeader}
      </h2>
      <h2 className="text-primary font-semibold text-4xl italic">
        {mainHeader}
      </h2>
    </>
  );
}