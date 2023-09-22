// lib/mailer.js

// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer"

// Функція для створення транспортера Nodemailer
async function createTransporter() {
  // Налаштування електронної пошти (ви можете використовувати свій власний провайдер електронної пошти)
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Хост для Gmail
    port: 587, // Порт для Gmail
    secure: false, // Використовуємо STARTTLS для з'єднання
    auth: {
      user: "vasilliy.yarosh@gmail.com", // Ваша адреса електронної пошти Gmail
      pass: "wasa2000WASA", // Ваш пароль електронної пошти Gmail
    },
  });

  return transporter;
}

// Функція для відправлення електронного листа
async function sendMail({ to, subject, text }) {
  try {
    const transporter = await createTransporter();

    const mailOptions = {
      from: "vasilliy.yarosh@gmail.com", // Встановіть свою адресу електронної пошти
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log("Електронний лист успішно відправлено.");
  } catch (error) {
    console.error("Помилка при відправленні електронного листа:", error);
  }
}

module.exports = { sendMail };
