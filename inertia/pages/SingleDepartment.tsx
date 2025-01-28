import CathedralTowerImg from "@/assets/images/cathedralTower.png";
import StaffList from "@/features/departments/components/StaffList/StaffList";
import { departments } from "@/features/departments/constants/departments_list";
import { DepartmentList } from "@/features/departments/types/departments";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import type { PageProps } from "@/types/page_props";
import { Head } from "@inertiajs/react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

function getDepartmentData(dep: string): DepartmentList {
    const isDepartmentExists = departments.filter((d) => d.link === dep);

    return isDepartmentExists.shift() || { name: "" };
}

export default function SingleDepartment({ department }: PageProps<{ department: string }>) {
    const { t } = useTranslation();

    const dep = getDepartmentData(department);

    const depTitle = t(dep.name);

    return (
        <MainLayout bannerTitle={depTitle} bannerImg={CathedralTowerImg}>
            <Head title={depTitle} />
            <Container sx={{ mt: 5, mb: 5 }}>
                <Typography>
                    {dep.name ? t(`${dep.name}_description`) : "Invalid department"}
                </Typography>
            </Container>
            {dep.page ? (
                <StaffList director={dep.page.director} sections={dep.page.sections} />
            ) : null}
        </MainLayout>
    );
}
