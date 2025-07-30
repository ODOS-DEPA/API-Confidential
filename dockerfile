# ใช้ Node.js image
FROM node:20

# ตั้ง working directory
WORKDIR /app

# คัดลอกไฟล์ทั้งหมดไปที่ container
COPY . .

# ติดตั้ง dependencies
RUN npm install

# ระบุ port ที่จะ expose
EXPOSE 5000

# สั่งรันแอป
CMD ["node", "server.js"]
