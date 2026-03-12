import Head from '@/shared/components/app-head'
import { useMemo } from 'react'
import { Phone } from 'lucide-react'
import { Typography } from '@/shared/components/ui/typography'
import HeroSection from '@/shared/components/layout/default/hero-section'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { getDepartmentBySlug } from '@/shared/constants/departments.constants'
import NotFoundPage from '@/pages/errors/not-found'
import { cn } from '@/lib/utils'
import DefaultBanner from '@/assets/images/cathedralTower.webp'
import type { InertiaProps } from '@/types'

type PageProps = InertiaProps<{ departmentSlug: string }>

export default function DepartmentSinglePage({ departmentSlug }: PageProps) {
  const department = useMemo(() => getDepartmentBySlug(departmentSlug), [departmentSlug])

  if (!department) return <NotFoundPage />

  const { page } = department
  const hasTeamSection = page?.director || (page?.teams && page.teams.length > 0)

  return (
    <>
      <Head title={department.title} />

      <HeroSection
        bgImage={page?.bannerImg || DefaultBanner}
        bgColor={page?.bannerColor}
        align="text-left"
      >
        <h1 className="text-4xl text-white font-bold">{department.title}</h1>
      </HeroSection>

      <section className="container mx-auto max-w-7xl text-justify py-16 px-5 md:px-16">
        <Typography>{page?.content || department.description}</Typography>
      </section>

      {hasTeamSection && (
        <section>
          <div className="w-full h-25 flex items-center bg-secondary mb-10 border-b-5 border-b-yellow-600">
            <div className="container mx-auto max-w-7xl text-justify py-16 px-16">
              <Typography
                variant="h2"
                className="border-0 m-0 text-secondary-foreground uppercase font-bold"
              >
                Notre équipe
              </Typography>
            </div>
          </div>

          {page?.director && (
            <div className="container mx-auto max-w-7xl pb-16 px-5 md:px-16">
              <div className="flex flex-col md:flex-row flex-wrap items-center md:items-end gap-8 md:gap-15">
                {page.director.image ? (
                  <img
                    src={page.director.image}
                    alt="Director image"
                    className="max-w-full h-auto md:w-[20%]"
                    loading="lazy"
                  />
                ) : (
                  <div className="bg-linear-to-b from-secondary to-yellow-800 h-70 w-[20%]" />
                )}
                <div>
                  <Typography variant="h3" className="uppercase font-bold m-0 p-0 leading-5">
                    {page.director.name || 'Vacant'}
                  </Typography>
                  <Typography className="text-secondary font-semibold leading-0 mb-10">
                    {page.director.position || 'N/A'}
                  </Typography>
                  <div className="flex flex-col">
                    <Typography
                      variant="h4"
                      className="uppercase font-bold text-base text-secondary"
                    >
                      Téléphone
                    </Typography>
                    <span className="flex items-center gap-2">
                      <Phone className="size-4" /> {page.director.phone || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="container mx-auto max-w-7xl pb-16 px-5 md:px-16">
            <div className="flex flex-col gap-12">
              {page?.teams?.map((team) => (
                <div key={team.title}>
                  <Typography variant="h3" className="font-bold text-secondary uppercase">
                    {team.title}
                  </Typography>
                  {team.members?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-5">
                      {team.members.map((member, i) => (
                        <Card key={i} className="h-full pt-0">
                          <CardHeader
                            className={cn('flex flex-col justify-end p-5 min-h-60 bg-cover', {
                              'bg-linear-to-b from-secondary to-yellow-950': !member.image,
                            })}
                            style={
                              member.image ? { backgroundImage: `url(${member.image})` } : undefined
                            }
                          >
                            <CardTitle className="text-xl text-white font-bold leading-4">
                              {member.name || 'VACANT'}
                            </CardTitle>
                            <CardDescription className="text-xl text-secondary font-medium">
                              {member.position}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Typography
                              variant="h4"
                              className="uppercase font-bold text-base text-secondary"
                            >
                              Téléphone
                            </Typography>
                            <span className="flex items-center gap-2">
                              <Phone className="size-4" /> {member.phone || '700'}
                            </span>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Typography className="italic">
                      Aucun membre dans l'équipe pour le moment.
                    </Typography>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
