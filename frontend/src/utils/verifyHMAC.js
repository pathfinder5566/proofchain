export async function verifyHMAC(certificate) {
  const response = await fetch("/api/verify-hmac", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(certificate)
  });
  return response.json();
}
