import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";

export default function Contact() {
  const form = useRef();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    emailjs.init("UcXFIsUFWOcw79oqI");
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_9d0cgf5", "template_pbu5tl2", form.current)
      .then(
        () => {
          setStatus({ success: true, message: "Message sent successfully!" });
          e.target.reset();
        },
        () => {
          setStatus({ success: false, message: "Failed to send message. Try again." });
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-50 to-blue-100 flex items-center justify-center px-6 py-16">
      <div className="bg-white shadow-xl rounded-3xl max-w-4xl w-full p-10 sm:p-12 lg:flex lg:space-x-12">
        {/* Left info panel */}
        <div className="mb-10 lg:mb-0 lg:w-1/2 flex flex-col justify-center">
          <h2 className="text-4xl font-extrabold text-indigo-700 mb-6">Contact Us</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Have questions or want to know more about the{" "}
            <span className="font-semibold">CSE Department VR Tour Project</span>? Reach out and connect with us!
          </p>

          <div className="space-y-5 text-gray-700">
            <p className="flex items-center space-x-2">
            <span>📧</span>
            <a
              href="mailto:ummadivishnuvardhan46@gmail.com"
              className="text-indigo-600 hover:underline text-sm truncate max-w-xs sm:max-w-full"
              title="ummadivishnuvardhan46@gmail.com"
            >
              ummadivishnuvardhan46@gmail.com
            </a>
            </p>
            <p className="flex items-center space-x-2">
              <span>📱</span>
              <span>+91 8317566265</span>
            </p>
            <p className="flex items-center space-x-2">
              <span>🌐</span>
              <a
                href="https://vishnu-portfolio-personal.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Portfolio
              </a>
            </p>
            <p className="flex items-center space-x-2">
              <span>💼</span>
              <a
                href="https://www.linkedin.com/in/ummadi-vishnuvardhan-a50b88221/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                Vishnu Vardhan (LinkedIn)
              </a>
            </p>
          </div>

          <p className="italic text-indigo-600 font-semibold mt-10">We’d love to hear from you and collaborate!</p>
        </div>

        {/* Form panel */}
        <form ref={form} onSubmit={sendEmail} className="lg:w-1/2 space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Your full name"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-2 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="your.email@example.com"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
          </div>

          <div>
            <label htmlFor="message" className="block mb-2 font-medium text-gray-700">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="5"
              required
              placeholder="Write your message here..."
              className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Send Message
          </button>

          {status && (
            <p
              className={`mt-4 text-center font-semibold ${
                status.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {status.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
