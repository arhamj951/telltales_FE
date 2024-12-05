import Typography from "@mui/material/Typography";

function CurrentDate() {
  const currentDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {currentDate}
    </Typography>
  );
}

export default CurrentDate;
