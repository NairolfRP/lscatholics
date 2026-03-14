import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import { DonateRecurring } from '@/features/donate/components/donate-recurring'
import { DonateForm } from '@/features/donate/components/form/donate-form'

export function DonateTabs() {
  return (
    <Tabs defaultValue="oneTime">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger
          className="data-[state=inactive]:cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          value="oneTime"
        >
          Don ponctuel
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=inactive]:cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
          value="recurring"
        >
          Don périodique
        </TabsTrigger>
      </TabsList>
      <TabsContent value="oneTime" forceMount className="data-[state=inactive]:hidden">
        <DonateForm />
      </TabsContent>
      <TabsContent value="recurring">
        <DonateRecurring />
      </TabsContent>
    </Tabs>
  )
}
