import CategoryFilter from "@/components/CategoryFilter";
import StyledTableCell from "@/components/tables/StyledTableCell";
import StyledTableRow from "@/components/tables/StyledTableRow";
import { JobCategory } from "@/enums/job_category";
import type { Job } from "@/features/jobs/types/jobs";
import { useEventCallback } from "@/hooks/use_event_callback";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import type { PageProps } from "@/types/page_props";
import { formatStringDate, getJobCategoryColor } from "@/utils/helpers";
import { Head, router } from "@inertiajs/react";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { ChangeEvent, Suspense, useMemo, useState } from "react";
import { Str } from "@shared/helpers/str";

const categories = [
    {
        id: 0,
        label: "job_archdiocesan_category",
    },
    {
        id: 1,
        label: "job_parish_category",
    },
    {
        id: 2,
        label: "job_cemeteries_category",
    },
];
const headRows = ["position", "organization_department", "location", "created_at"];

const paginationOptions = [10, 25, 100];

export default function Jobs({ jobs }: PageProps<{ jobs: Job[] }>) {
    const { t } = useTranslation();
    const [pagination, setPagination] = useState<{ page: number; rowsPerPage: number }>({
        page: 0,
        rowsPerPage: paginationOptions[0],
    });
    const [hiddenCategories, setHiddenCategories] = useState<JobCategory[]>([]);

    const jobsDisplayed = useMemo(
        () => jobs.filter((j: { category: JobCategory }) => !hiddenCategories.includes(j.category)),
        [jobs, hiddenCategories],
    );

    const paginatedJobs = useMemo(() => {
        const start = pagination.page * pagination.rowsPerPage;
        return jobsDisplayed.slice(start, start + pagination.rowsPerPage);
    }, [jobsDisplayed, pagination]);

    const handleChangeCategory = useEventCallback((categoryID: JobCategory) => {
        setHiddenCategories((prev) => {
            const isHidden = prev.includes(categoryID);
            return isHidden ? prev.filter((cat) => cat !== categoryID) : [...prev, categoryID];
        });
    });

    const handleChangePage = useEventCallback((_: unknown, newPage: number) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    });

    const handleChangeRowsPerPage = useEventCallback((event: ChangeEvent<HTMLInputElement>) => {
        const newRowsPerPage = +event.target.value;
        setPagination({ rowsPerPage: newRowsPerPage, page: 0 });
    });

    return (
        <MainLayout bannerTitle={t("employment")}>
            <Head title={t("employment")}></Head>
            <Container sx={{ mt: 5, mb: 15 }}>
                <CategoryFilter
                    categories={categories}
                    hiddenCategories={hiddenCategories}
                    onChangeCategory={handleChangeCategory}
                />
                <Paper sx={{ width: "100%" }}>
                    <TableContainer>
                        <Table aria-label={t("employment")}>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: "primary.main" }}>
                                    {headRows.map((headRow, index) => (
                                        <StyledTableCell key={index}>{t(headRow)}</StyledTableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <Suspense fallback="Loading...">
                                    {paginatedJobs.map(async (job: Job) => {
                                        return (
                                            <StyledTableRow
                                                key={job.id}
                                                hover
                                                tabIndex={-1}
                                                sx={{ cursor: "pointer" }}
                                                onClick={() =>
                                                    router.visit(
                                                        `job/${job.id}/${Str.slug(job.title)}`,
                                                    )
                                                }
                                            >
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                    sx={{
                                                        color: getJobCategoryColor(job.category),
                                                    }}
                                                >
                                                    {job.title}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {job.organization}
                                                </StyledTableCell>
                                                <StyledTableCell>{job.location}</StyledTableCell>
                                                <StyledTableCell>
                                                    {t("date", formatStringDate(job.createdAt))}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </Suspense>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={paginationOptions}
                        component="div"
                        count={jobsDisplayed.length}
                        rowsPerPage={pagination.rowsPerPage}
                        page={pagination.page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Container>
        </MainLayout>
    );
}
