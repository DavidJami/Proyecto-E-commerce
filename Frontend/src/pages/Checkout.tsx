import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cartStore } from "@/lib/cart-store";
import { getCurrentUser } from "@/lib/api";

export default function Checkout() {
  const navigate = useNavigate();
  const [sameAddress, setSameAddress] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [contact, setContact] = useState({ name: "", email: "", phone: "" });
  const [shipping, setShipping] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Argentina",
  });
  const [billing, setBilling] = useState({
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "Argentina",
  });
  const [card, setCard] = useState({ holder: "", number: "", exp: "", cvc: "" });
  const [items, setItems] = useState(cartStore.getItems());

  // VALIDACIONES ===============================
  const validateAll = () => {
    const newErr: Record<string, string> = {};

    // CONTACTO
    if (!contact.name.trim()) newErr.name = "Ingrese su nombre completo.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email))
      newErr.email = "Email inválido.";
    if (!/^[0-9()+\s-]{6,20}$/.test(contact.phone))
      newErr.phone = "Teléfono inválido.";

    // SHIPPING
    if (!shipping.address) newErr.address = "Ingrese la dirección.";
    if (!shipping.city) newErr.city = "Ingrese la ciudad.";
    if (!shipping.state) newErr.state = "Ingrese la provincia.";
    if (!shipping.zip) newErr.zip = "Ingrese el código postal.";
    if (!shipping.country) newErr.country = "Ingrese el país.";

    // BILLING (si aplica)
    if (!sameAddress) {
      if (!billing.address) newErr.b_address = "Ingrese la dirección.";
      if (!billing.city) newErr.b_city = "Ingrese la ciudad.";
      if (!billing.state) newErr.b_state = "Ingrese la provincia.";
      if (!billing.zip) newErr.b_zip = "Ingrese el código postal.";
      if (!billing.country) newErr.b_country = "Ingrese el país.";
    }

    // CARD
    if (!card.holder.trim()) newErr.holder = "Ingrese el titular.";
    if (!/^[0-9\s]{13,19}$/.test(card.number))
      newErr.number = "Número de tarjeta inválido.";
    if (!/^\d{2}\/\d{2}$/.test(card.exp))
      newErr.exp = "Formato inválido. Use MM/AA.";
    if (!/^\d{3,4}$/.test(card.cvc))
      newErr.cvc = "CVC inválido.";

    setErrors(newErr);
    return Object.keys(newErr).length === 0;
  };

  // EFFECTS ===============
  useEffect(() => {
    document.title = "Checkout - Pago | Tienda";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Finaliza tu compra de forma segura y rápida.");
  }, []);

  useEffect(() => {
    const unsub = cartStore.subscribe(() => setItems(cartStore.getItems()));
    return () => unsub();
  }, []);

  useEffect(() => {
    const user = getCurrentUser?.();
    if (user) {
      setContact((c) => ({ ...c, name: user.name ?? user.fullName ?? "", email: user.email ?? "" }));
    }
  }, []);

  // CALCULOS ===============
  const subtotal = useMemo(() => items.reduce((s, it) => s + it.price * it.quantity, 0), [items]);
  const shippingCost = 0;
  const tax = Math.round(subtotal * 0.21);
  const total = subtotal + shippingCost + tax;

  // SUBMIT ===============
  const onSubmit = (e) => {
    e.preventDefault();
    if (!validateAll()) return;

    cartStore.clear();
    navigate("/payment-success");
  };

  // =====================================================================
  // RENDER
  // =====================================================================
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold tracking-tight mb-6">Checkout y pago</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form onSubmit={onSubmit} className="lg:col-span-2 space-y-6">

          {/* ---------------- CONTACTO ---------------- */}
          <Card>
            <CardHeader><CardTitle>Contacto</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              
              {/* NAME */}
              <div className="space-y-2">
                <Label htmlFor="name">Nombre y apellido</Label>
                <Input id="name" value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })} />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              {/* PHONE */}
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>

            </CardContent>
          </Card>

          {/* ---------------- SHIPPING ---------------- */}
          <Card>
            <CardHeader><CardTitle>Dirección de envío</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input id="address" value={shipping.address}
                  onChange={(e) => setShipping({ ...shipping, address: e.target.value })} />
                {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Ciudad</Label>
                <Input id="city" value={shipping.city}
                  onChange={(e) => setShipping({ ...shipping, city: e.target.value })} />
                {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">Provincia</Label>
                <Input id="state" value={shipping.state}
                  onChange={(e) => setShipping({ ...shipping, state: e.target.value })} />
                {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">Código postal</Label>
                <Input id="zip" value={shipping.zip}
                  onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} />
                {errors.zip && <p className="text-red-500 text-sm">{errors.zip}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">País</Label>
                <Input id="country" value={shipping.country}
                  onChange={(e) => setShipping({ ...shipping, country: e.target.value })} />
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>

              <div className="flex items-center gap-2 sm:col-span-2">
                <Checkbox id="same" checked={sameAddress} onCheckedChange={(v) => setSameAddress(Boolean(v))} />
                <Label htmlFor="same">Usar esta misma dirección para facturación</Label>
              </div>
            </CardContent>
          </Card>

          {/* ---------------- BILLING ---------------- */}
          {!sameAddress && (
            <Card>
              <CardHeader><CardTitle>Dirección de facturación</CardTitle></CardHeader>
              <CardContent className="grid sm:grid-cols-2 gap-4">

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="b_address">Dirección</Label>
                  <Input id="b_address" value={billing.address}
                    onChange={(e) => setBilling({ ...billing, address: e.target.value })} />
                  {errors.b_address && <p className="text-red-500 text-sm">{errors.b_address}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="b_city">Ciudad</Label>
                  <Input id="b_city" value={billing.city}
                    onChange={(e) => setBilling({ ...billing, city: e.target.value })} />
                  {errors.b_city && <p className="text-red-500 text-sm">{errors.b_city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="b_state">Provincia</Label>
                  <Input id="b_state" value={billing.state}
                    onChange={(e) => setBilling({ ...billing, state: e.target.value })} />
                  {errors.b_state && <p className="text-red-500 text-sm">{errors.b_state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="b_zip">Código postal</Label>
                  <Input id="b_zip" value={billing.zip}
                    onChange={(e) => setBilling({ ...billing, zip: e.target.value })} />
                  {errors.b_zip && <p className="text-red-500 text-sm">{errors.b_zip}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="b_country">País</Label>
                  <Input id="b_country" value={billing.country}
                    onChange={(e) => setBilling({ ...billing, country: e.target.value })} />
                  {errors.b_country && <p className="text-red-500 text-sm">{errors.b_country}</p>}
                </div>

              </CardContent>
            </Card>
          )}

          {/* ---------------- CARD ---------------- */}
          <Card>
            <CardHeader><CardTitle>Método de pago</CardTitle></CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="holder">Titular de la tarjeta</Label>
                <Input id="holder" value={card.holder}
                  onChange={(e) => setCard({ ...card, holder: e.target.value })} />
                {errors.holder && <p className="text-red-500 text-sm">{errors.holder}</p>}
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="number">Número de tarjeta</Label>
                <Input id="number" inputMode="numeric" placeholder="0000 0000 0000 0000"
                  value={card.number} onChange={(e) => setCard({ ...card, number: e.target.value })} />
                {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="exp">Vencimiento (MM/AA)</Label>
                <Input id="exp" placeholder="MM/AA"
                  value={card.exp} onChange={(e) => setCard({ ...card, exp: e.target.value })} />
                {errors.exp && <p className="text-red-500 text-sm">{errors.exp}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" inputMode="numeric" placeholder="123"
                  value={card.cvc} onChange={(e) => setCard({ ...card, cvc: e.target.value })} />
                {errors.cvc && <p className="text-red-500 text-sm">{errors.cvc}</p>}
              </div>

              <p className="text-sm text-muted-foreground sm:col-span-2">
                Este formulario es solo visual. No se procesan datos reales.
              </p>

              <div className="sm:col-span-2 flex gap-3">
                <Button type="button" variant="secondary" onClick={() => navigate("/payment-canceled")}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Pagar ahora
                </Button>
              </div>

            </CardContent>
          </Card>

        </form>

        {/* ---------------- SUMMARY ---------------- */}
        <aside className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Resumen de compra</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
                ) : (
                  <ul className="space-y-2">
                    {items.map((it) => (
                      <li key={it.id} className="flex items-center justify-between text-sm">
                        <span>{it.name} × {it.quantity}</span>
                        <span>${(it.price * it.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Separator />
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Envío</span><span>${shippingCost.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Impuestos</span><span>${tax.toFixed(2)}</span></div>
                <Separator />
                <div className="flex justify-between font-medium"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </CardContent>
          </Card>
        </aside>

      </div>
    </main>
  );
}
