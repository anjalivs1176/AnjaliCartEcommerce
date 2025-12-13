export const getActiveCoupons = async () => {
  const token = localStorage.getItem("token") || "";

  const res = await fetch("http://localhost:8080/api/coupons/active", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
};
