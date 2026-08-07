import { DonateForm } from '#/features/donate/components/donate-form.tsx'
import { DonateRecurring } from '#/features/donate/components/donate-recurring.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '#shared/components/ui/tabs.tsx'

export function DonateTabs() {
  return (
    <Tabs defaultValue="oneTime" className="gap-4">
      <TabsList className="grid w-full grid-cols-2 rounded-lg border bg-muted p-1">
        <TabsTrigger
          value="oneTime"
          className="data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
        >
          Don ponctuel
        </TabsTrigger>
        <TabsTrigger
          value="recurring"
          className="data-active:bg-primary data-active:text-primary-foreground dark:data-active:bg-primary dark:data-active:text-primary-foreground"
        >
          Don périodique
        </TabsTrigger>
      </TabsList>
      <TabsContent value="oneTime">
        <DonateForm />
      </TabsContent>
      <TabsContent value="recurring">
        <DonateRecurring />
      </TabsContent>
    </Tabs>
  )
}
