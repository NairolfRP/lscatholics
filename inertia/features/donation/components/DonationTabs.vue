<template>
  <Tabs default-value="oneTime" :unmount-on-hide="false">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger
        class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        value="oneTime"
      >
        Don ponctuel
      </TabsTrigger>
      <TabsTrigger
        class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
        value="recurring"
      >
        Don périodique
      </TabsTrigger>
    </TabsList>
    <TabsContent value="oneTime">
      <DonationForm />
    </TabsContent>
    <TabsContent value="recurring">
      <RecurringDonationInfo />
    </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs'
import RecurringDonationInfo from '@/features/donation/components/recurring/RecurringDonationInfo.vue'
import DonationForm from '@/features/donation/components/form/DonationForm.vue'
</script>
