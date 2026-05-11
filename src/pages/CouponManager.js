import React, { useState, useEffect } from "react";
import { CouponService } from "../services/dataService";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [img, setImg] = useState("");

  useEffect(() => {
    setCoupons(CouponService.getAll());
  }, []);

  const handleCreate = (e) => {
    e.preventDefault();
    const finalImg = img || `https://picsum.photos/seed/${code}/300/200`;
    CouponService.create(code, discount, finalImg);
    setCoupons(CouponService.getAll());
    setCode("");
    setDiscount("");
    setImg("");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Cupones</h1>
        {/* En una app real, esto sería un modal separado */}
        <div className="bg-white p-4 rounded shadow border">
           <input placeholder="Código" value={code} onChange={e=>setCode(e.target.value)} className="border p-1 rounded mr-2"/>
           <input placeholder="%" type="number" value={discount} onChange={e=>setDiscount(e.target.value)} className="border p-1 rounded mr-2"/>
           <Button onClick={handleCreate}>Crear</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {coupons.map((c, idx) => (
          <Card key={idx} className="flex flex-col items-center p-0">
            <img src={c.img} className="w-full h-32 object-cover" />
            <div className="p-4 text-center -mt-6 bg-white w-full rounded-t-xl">
              <div className="font-mono font-bold text-indigo-600 text-lg">{c.code}</div>
              <div className="text-3xl font-black">-{c.discount}%</div>
              <div className="text-green-600 font-bold text-sm mt-1">ACTIVO</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CouponManager;