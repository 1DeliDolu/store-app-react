import { Box, Divider, Stack, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function Review() {
  const { getValues } = useFormContext();
  const firstName = getValues("firstname") || getValues("firstName");
  const lastName = getValues("lastname") || getValues("lastName");
  const phone = getValues("phone");
  const street = getValues("street");
  const houseNumber = getValues("houseNumber");
  const postalCode = getValues("postalCode");
  const city = getValues("city");
  const legacyAddress = getValues("address");
  // Derive display lines: prefer structured fields; otherwise try to parse legacy free-text address
  let displayStreetLine = "";
  let displaySecondLine = "";

  if (street || houseNumber) {
    displayStreetLine = `${street || ""} ${houseNumber || ""}`.trim();
    if (postalCode || city)
      displaySecondLine = `${postalCode || ""} ${city || ""}`.trim();
  } else if (legacyAddress) {
    // Try to split legacy address like: "Am Richtsberg 20, 35039 Marburg" or "Am Richtsberg 20 35039 Marburg"
    const postalMatch = legacyAddress.match(/(\d{5})\s+(.+)$/);
    if (postalMatch) {
      // postalMatch[1] = postalCode, [2] = city
      displaySecondLine = `${postalMatch[1]} ${postalMatch[2]}`.trim();
      // Street is whatever comes before the postal code
      displayStreetLine = legacyAddress
        .slice(0, postalMatch.index)
        .replace(/[,\s]+$/g, "")
        .trim();
    } else {
      // No postal code found — fallback to showing the full legacy address on the first line
      displayStreetLine = legacyAddress.trim();
    }
  }
  return (
    <Stack spacing={2} sx={{ mb: 3 }} divider={<Divider />}>
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Teslimat Bilgileri
        </Typography>
        <Typography gutterBottom>
          {firstName} {lastName}
        </Typography>
        <Typography gutterBottom>{phone}</Typography>
        {(() => {
          const orderId =
            getValues("orderId") ||
            getValues("orderNumber") ||
            getValues("orderNo") ||
            getValues("order");
          return orderId ? (
            <Typography variant="body2" gutterBottom>
              Sipariş no: #{orderId}
            </Typography>
          ) : null;
        })()}

        <Typography gutterBottom>
          {displayStreetLine || legacyAddress}
        </Typography>
        {displaySecondLine ? (
          <Typography gutterBottom>{displaySecondLine}</Typography>
        ) : null}
      </Box>

      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Ödeme Bilgileri
        </Typography>
        <Typography gutterBottom>{getValues("cardname")}</Typography>
        <Typography gutterBottom>{getValues("cardnumber")}</Typography>
        <Typography gutterBottom>{getValues("expirydate")}</Typography>
      </Box>
    </Stack>
  );
}
