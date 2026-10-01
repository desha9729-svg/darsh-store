"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, MessageSquare, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#F5F5F3] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#686B6B]">
            Client Relations & Support
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B0B0B] tracking-tight uppercase mt-1">
            Contact DRSH (درش)
          </h1>
          <p className="text-xs text-neutral-500 mt-2">
            فريق خدمة عملاء درش متاح لمساعدتك في أي استفسار حول المنتجات أو مواعيد الشحن واستبدال الطلبات.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Contact Channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-sm border border-neutral-200 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B0B0B] border-b border-neutral-100 pb-3">
                Direct Channels
              </h3>

              <div className="flex items-start gap-3 text-xs">
                <Phone className="w-4 h-4 text-[#0B0B0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-black block">Phone Support</span>
                  <a href="tel:+201000000000" className="text-neutral-600 hover:text-black">
                    +20 100 000 0000
                  </a>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Sat - Thu: 10:00 AM - 10:00 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <MessageSquare className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-black block">WhatsApp Chat</span>
                  <a
                    href="https://wa.me/201000000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 font-semibold hover:underline"
                  >
                    Chat with DRSH on WhatsApp
                  </a>
                  <p className="text-[10px] text-neutral-400 mt-0.5">Quick order questions & tracking</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <Mail className="w-4 h-4 text-[#0B0B0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-black block">Email Support</span>
                  <a href="mailto:support@drsh-store.com" className="text-neutral-600 hover:text-black">
                    support@drsh-store.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <MapPin className="w-4 h-4 text-[#0B0B0B] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-black block">Headquarters</span>
                  <span className="text-neutral-600">Cairo, Egypt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-neutral-200 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-700 mx-auto" />
                <h3 className="text-base font-bold text-[#0B0B0B]">Message Received</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  شكراً لتواصلك مع درش. سيقوم أحد مسؤولي خدمة العملاء بالرد عليك خلال ساعات العمل.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B0B0B] pb-2 border-b border-neutral-100">
                  Send Us a Message
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Your Name (الاسم) *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Hassan"
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Mobile Phone (الهاتف أو واتساب) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Inquiry Details (الرسالة أو رقم الأوردر) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with DRSH products or orders?"
                    className="w-full bg-[#F5F5F3] border border-neutral-300 rounded-sm p-3 text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#0B0B0B] text-white text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-[#D9C9B3] hover:text-[#0B0B0B] transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
