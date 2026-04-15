import axios from 'axios';
const test = async () => {
    try {
        const res = await axios.post('http://localhost:8001/api/user/register', { name: "test", email: "test2@example.com", password: "password123" });
        console.log("Success:", res.data);
    } catch (err) {
        console.error("Error:", err.message);
    }
}
test();
