import CategoryButton from "@/components/CategoryButton";
import { getJobCategoryColor } from "@/utils/helpers";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/hooks/useTranslation";

interface CategoryFilterProps {
    categories: { id: number; label: string }[];
    hiddenCategories: number[];
    onChangeCategory: (id: number) => void;
}

export default function CategoryFilter({ categories, hiddenCategories, onChangeCategory }: CategoryFilterProps) {
    const { t } = useTranslation();

    return (
        <Stack direction={{ sm: "column", md: "row" }} spacing={{ sm: 3, md: 1 }} sx={{ mb: { md: 2 } }} alignItems="center">
            <Typography sx={{ fontWeight: 800, textTransform: "uppercase" }}>{t("show_me")}</Typography>
            {categories.map(({ id, label }) => (
                <CategoryButton key={id} onClick={() => onChangeCategory(id)} selected={!hiddenCategories.includes(id)} color={getJobCategoryColor(id)}>
                    {t(label)}
                </CategoryButton>
            ))}
        </Stack>
    );
}
