import { useState, useMemo } from "react";
import { WHATSAPP_NUMBER, WHATSAPP_URL } from "@/config";
import type { Property } from "@/data/properties";

interface UseContactFormReturn {
  name: string;
  msgText: string;
  setName: (v: string) => void;
  setMsgText: (v: string) => void;
  handleSend: (e: React.FormEvent) => void;
}

export function useContactForm(property: Property): UseContactFormReturn {
  const [name, setName] = useState("");
  const [msgText, setMsgText] = useState("");

  const url = useMemo(() => {
    const phone = property.contactPhone ?? WHATSAPP_NUMBER;
    const message = [
      `مرحباً، أنا ${name || "مهتم"}`,
      `أود الاستفسار عن: ${property.title}`,
      `الحي: ${property.neighborhood}`,
      msgText ? `الرسالة: ${msgText}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }, [name, msgText, property]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(url, "_blank");
  };

  return { name, msgText, setName, setMsgText, handleSend };
}
