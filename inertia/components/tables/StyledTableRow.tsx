import { styled } from "@mui/material";
import TableRow from "@mui/material/TableRow";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": { backgroundColor: theme.palette.action.hover },
    "&:last-child td, &:last-child th": { border: 0 },
}));

export default StyledTableRow;
