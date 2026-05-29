import QRCode from "qrcode";

export function generateQRDataURL(verifyUrl) {
  return QRCode.toDataURL(verifyUrl, {
    margin: 1,
    width: 220,
    color: {
      dark: "#07111f",
      light: "#ffffff"
    }
  });
}
