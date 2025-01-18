import { styled } from "@mui/material";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontSize: 16,
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontWeight: 800,
    },
    [`&.${tableCellClasses.body}`]: { fontSize: 16 },
}));

export default StyledTableCell;
