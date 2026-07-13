

# AI-Based Attendance Management System

An intelligent **attendance management system** leveraging **AI facial recognition**, Spring Boot, Next.js, MySQL, and Python to automate and secure attendance tracking for online classes. The system prevents proxy attendance, ensures student authentication, and provides a seamless user experience for both teachers and students.

---

## 🚀 Features

* **Student Registration & Authentication**

  * Students register with roll number, password, and facial image.
  * Facial images securely stored in **Cloudinary**.
  * Passwords are securely hashed.

* **AI-Based Face Verification**

  * Python-based facial recognition verifies students before joining online sessions.
  * Prevents proxy attendance by ensuring the student’s identity.

* **Teacher Functionality**

  * Teachers can create classes with meeting URLs.
  * Attendance is automatically marked once the student verifies their face.

* **Secure Session Management**

  * JWT-based authentication for secure sessions.
  * HTTP-only cookies to prevent unauthorized access and session hijacking.

* **Cloud Integration**

  * Facial images stored on **Cloudinary** for efficient and secure access.
  * Seamless interaction between frontend, backend, and AI services.

---

## 🛠 Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Backend        | Spring Boot, Java           |
| Frontend       | Next.js, React              |
| Database       | MySQL                       |
| AI Service     | Python (Facial Recognition) |
| Cloud Storage  | Cloudinary                  |
| Authentication | JWT, HTTP-only Cookies      |

---

## 📌 How It Works

1. **Student Registration**: Students register with credentials and a facial image.
2. **Face Storage & Processing**: Images are uploaded to Cloudinary and processed by the AI model.
3. **Class Creation**: Teachers create classes with meeting URLs.
4. **Attendance Verification**: Students verify their face via AI before joining the session.
5. **Secure Attendance Marking**: Attendance is automatically recorded only after successful verification.

---

## 🔒 Security

* **JWT Authentication** ensures that only authorized users can access resources.
* **HTTP-only cookies** protect session tokens from XSS attacks.
* **Encrypted passwords** prevent exposure of sensitive student data.
* **Facial recognition verification** ensures authenticity and prevents proxy attendance.

---

## 💻 Getting Started

### Prerequisites

* Java 17+
* Node.js 18+
* MySQL 8+
* Python 3.9+
* Cloudinary account

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/ai-attendance-system.git
cd ai-attendance-system
```

2. **Backend Setup (Spring Boot)**

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

3. **Frontend Setup (Next.js)**

```bash
cd frontend
npm install
npm run dev
```

4. **Python Face Recognition Service**

```bash
cd face-recognition-service
pip install -r requirements.txt
python app.py
```

5. **Configure Environment Variables**

* `.env` for backend: Database credentials, JWT secret, Cloudinary API keys
* `.env` for frontend: API base URL

---

## 📂 Project Structure

```
├── backend                 # Spring Boot backend
├── frontend                # Next.js frontend
├── face-recognition-service # Python AI service
├── README.md
├── .env.example
```

---

## 🧪 Future Enhancements

* Real-time live face recognition during sessions
* Mobile app integration
* Detailed attendance analytics for teachers
* Multi-factor authentication for extra security

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---


---

I can also make a **super visually appealing version with badges, GIF workflow demo, and tables for quick API reference** if you want it to look *GitHub professional*.

Do you want me to create that enhanced version too?


# photos
home page
<img width="1912" height="908" alt="Screenshot 2026-07-13 122344" src="https://github.com/user-attachments/assets/b78ed3c1-07b8-4a6e-8f75-0adf2b6d402e" />

face register page
<img width="1894" height="914" alt="Screenshot 2026-07-13 122613" src="https://github.com/user-attachments/assets/75dd9396-93f3-4c37-a20f-9f754947d0d6" />

login page
<img width="1895" height="908" alt="Screenshot 2026-07-13 122709" src="https://github.com/user-attachments/assets/c2ee406f-d72b-4451-a6be-41ba2c5ed060" />

## student page
dashboard
<img width="1900" height="911" alt="Screenshot 2026-07-13 122818" src="https://github.com/user-attachments/assets/d2c0c50c-5b31-417a-a541-3ee115959709" />
classes
<img width="1887" height="905" alt="Screenshot 2026-07-13 122854" src="https://github.com/user-attachments/assets/7fab30a0-fe6e-4c8c-9e2c-6acf5f76f4bd" />
class details page
<img width="1898" height="910" alt="Screenshot 2026-07-13 122909" src="https://github.com/user-attachments/assets/65b6ae00-8378-4131-8d8f-da207ebff718" />
face verification before class join
<img width="1890" height="915" alt="Screenshot 2026-07-13 122929" src="https://github.com/user-attachments/assets/870f80c8-f5df-4f16-9156-44090d6ba1e1" />
search classes
<img width="1893" height="915" alt="Screenshot 2026-07-13 122947" src="https://github.com/user-attachments/assets/e594f837-d07f-452e-b34e-75c366789617" />

## teacher page

dashboard
<img width="1887" height="896" alt="Screenshot 2026-07-13 123146" src="https://github.com/user-attachments/assets/df837d9d-4f11-4de2-b3b7-ba3f4a134dfd" />

create class
<img width="1889" height="895" alt="Screenshot 2026-07-13 123202" src="https://github.com/user-attachments/assets/17ffe7a5-ec67-4025-a395-e2cef6ff18f1" />

attenddance page
<img width="1908" height="917" alt="Screenshot 2026-07-04 151913" src="https://github.com/user-attachments/assets/dba067c0-6852-4f79-80c4-86f3886f00d5" />







