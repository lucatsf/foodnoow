'use client';
import AddressInputs from "@/components/layout/AddressInputs";
import EditableImage from "@/components/layout/EditableImage";
import {useProfile} from "@/components/UseProfile";
import {useEffect, useState} from "react";

export default function UserForm({user,onSave}) {
  const [userName, setUserName] = useState(user?.name || '');
  const [image, setImage] = useState(user?.image || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '');
  const [number, setNumber] = useState(user?.number || '');
  const [neighborhood, setNeighborhood] = useState(user?.neighborhood || '');
  const [complement, setComplement] = useState(user?.complement || '');
  const [admin, setAdmin] = useState(user?.admin || false);
  const [company, setCompany] = useState(user?.company_id || '');
  const [city, setCity] = useState(user?.city || '');
  const [companies, setCompanies] = useState([]);
  const {data:loggedInUserData} = useProfile();

  function handleAddressChange(propName, value) {
    if (propName === 'phone') setPhone(value);
    if (propName === 'streetAddress') setStreetAddress(value);
    if (propName === 'number') setNumber(value);
    if (propName === 'neighborhood') setNeighborhood(value);
    if (propName === 'complement') setComplement(value);
    if (propName === 'city') setCity(value);
  }

  useEffect(() => {
    fetch('/api/companies').then(res => {
      res.json().then(companies => {
        setCompanies(companies);
      });
    });
  }, []);

  return (
    <div className="md:flex gap-4">
      <div>
        <div className="p-2 rounded-lg relative max-w-[120px]">
          <EditableImage link={image} setLink={setImage} />
        </div>
      </div>
      <form
        className="grow"
        onSubmit={ev =>
          onSave(ev, {
            name:userName, image, phone, admin, city,
            streetAddress, neighborhood, complement, number, company_id:company
          })
        }
      >
        <label>
          Seu nome
        </label>
        <input
          type="text" placeholder="Seu nome"
          value={userName} onChange={ev => setUserName(ev.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          disabled={true}
          value={user?.email}
          placeholder={'email'}
        />
        <AddressInputs
          addressProps={{phone, streetAddress, city, number, neighborhood, complement}}
          setAddressProp={handleAddressChange}
        />
        {loggedInUserData.root && (
          <div>
            <label>Empresa</label>
            <select value={company} onChange={ev => setCompany(ev.target.value)}>
              {companies?.length > 0 && companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        )}
        {loggedInUserData.admin && (
          <div>
            <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
              <input
                id="adminCb" type="checkbox" className="" value={'1'}
                checked={admin}
                onChange={ev => setAdmin(ev.target.checked)}
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}