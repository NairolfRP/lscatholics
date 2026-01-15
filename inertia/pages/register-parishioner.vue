<template>
  <Head title="S'enregistrer comme paroissien" />

  <PageBanner py="16">
    <Typography variant="h2" class="border-0 text-4xl font-bold mb-4 font-serif">
      Bienvenue chez vous !
    </Typography>
    <p class="text-xl opacity-90">
      Nous sommes ravis que vous vous intéressiez à rejoindre notre famille de familles.
      L'enregistrement aide les paroisses à mieux vous servir et vous permet de rester en contact
      avec elles.
    </p>
  </PageBanner>

  <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="grid md:grid-cols-3 gap-6 mb-12">
      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-col items-center text-center">
            <Users class="w-10 h-10 text-blue-600 mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Rejoindre nos communautés</h3>
            <p class="text-sm text-gray-600">
              Rencontrez d'autres paroissiens et grandissez ensemble dans la foi.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-col items-center text-center">
            <Heart class="w-10 h-10 text-purple-600 mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Développement spirituel</h3>
            <p class="text-sm text-gray-600">
              Accéder aux sacrements, aux activités pastorales et aux programmes à la foi religieuse
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent class="pt-6">
          <div class="flex flex-col items-center text-center">
            <Church class="w-10 h-10 text-indigo-600 mb-3" />
            <h3 class="font-semibold text-gray-900 mb-2">Restez informés</h3>
            <p class="text-sm text-gray-600">
              Recevez des informations sur les horaires des messes, les événements et les actualités
              des paroisses.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Card class="shadow-lg">
      <CardHeader>
        <CardTitle class="text-2xl">Formulaire d'enregistrement comme paroissien</CardTitle>
        <CardDescription>
          Veuilez remplir les informations ci-dessous pour enregistrer votre foyer comme
          paroissiens.<br /><br />

          <span class="font-bold">
            Seuls les champs indiqués avec un astérisque (*) sont obligatoires.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthentificationRequiredAlert v-if="!user" text="pour enregistrer votre foyer en ligne." />
        <form v-else @submit.prevent="onSubmit" class="space-y-8">
          <div class="space-y-4">
            <FormField v-slot="{ componentField }" type="radio" name="recordType">
              <div class="space-y-2 my-5">
                <FormItem>
                  <FormLabel class="font-bold mb-2">
                    S'agit t-il d'un nouvel enregistrement ou d'une mise à jour d'un enregistrement
                    existant ?
                  </FormLabel>

                  <FormControl>
                    <RadioGroup
                      v-bind="componentField"
                      :orientation="'horizontal'"
                      class="flex flex-col md:flex-row space-y-2 md:space-y-0 md:gap-8"
                      required
                    >
                      <FormItem
                        v-for="option in [
                          {
                            value: 'new',
                            label: `Nouvel enregistrement`,
                          },
                          {
                            value: 'update',
                            label: `Mise à jour d'un enregistrement`,
                          },
                        ]"
                        class="flex items-center space-x-2"
                      >
                        <FormControl>
                          <RadioGroupItem :value="option.value" />
                        </FormControl>
                        <FormLabel class="font-normal">{{ option.label }}</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            </FormField>

            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users class="w-5 h-5" />
              Informations personnelles
            </h3>
            <FormField v-slot="{ componentField }" name="civilTitle">
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>Titre de civilité *</FormLabel>
                  <Select v-bind="componentField" required>
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Sélectionnez un titre de civilité" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="cTitle of CIVIL_TITLES" :value="cTitle.id">
                          {{ cTitle.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="maritalStatus">
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>État matrimonial *</FormLabel>
                  <Select v-bind="componentField" required>
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Sélectionnez un état matrimonial" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem v-for="mStatus of MARITAL_STATUS" :value="mStatus.id">
                          {{ mStatus.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <div class="grid md:grid-cols-2 gap-4">
              <FormField
                v-slot="{ componentField }"
                name="firstname"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Prénom *</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" required placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="lastname"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Nom de famille *</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" required placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="gender">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Sexe *</FormLabel>
                    <Select v-bind="componentField" required>
                      <FormControl>
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Sélectionnez un genre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem v-for="gender of GENDERS" :value="gender.id">
                            {{ gender.label }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField v-slot="{ value }" name="age">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Âge *</FormLabel>
                    <NumberField
                      id="age"
                      :min="16"
                      :max="120"
                      :model-value="value ?? null"
                      @update:model-value="
                        (v) => {
                          if (v) {
                            form.setFieldValue('age', v)
                          } else {
                            form.setFieldValue('age', undefined)
                          }
                        }
                      "
                      required
                    >
                      <NumberFieldContent>
                        <NumberFieldDecrement />
                        <FormControl>
                          <NumberFieldInput />
                        </FormControl>
                        <NumberFieldIncrement />
                      </NumberFieldContent>
                    </NumberField>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>
            </div>

            <FormField v-slot="{ componentField }" name="ethnicCommunity">
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>Êtes-vous membre d'une communauté ethnique spécifique ?</FormLabel>
                  <Select v-bind="componentField">
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Sélectionner une communauté" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="community of LOCAL_ETHNICS_COMMUNITIES"
                          :value="community.id"
                        >
                          {{ community.label }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <FormField
              v-slot="{ componentField }"
              name="occupation"
              :validate-on-blur="!isFieldDirty"
            >
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>Activité / Emploi</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" placeholder="Votre activité ou travail" />
                  </FormControl>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <PhoneCall class="size-5" />
              Informations de contact
            </h3>

            <div class="grid md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="phone" :validate-on-blur="!isFieldDirty">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel class="flex items-center gap-2"> Numéro de téléphone *</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" type="tel" required placeholder="1234567" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField
                v-slot="{ componentField }"
                name="emergencyPhone"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel class="flex items-center gap-2">
                      N° de téléphone à appeler en cas d'urgence
                    </FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" type="tel" placeholder="1234567" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MapPin class="w-5 h-5" />
              Adresse
            </h3>

            <div class="grid md:grid-cols-2 gap-4">
              <FormField
                v-slot="{ componentField }"
                name="address"
                :validate-on-blur="!isFieldDirty"
              >
                <FormItem>
                  <div class="space-y-2 mb-7">
                    <FormLabel>Adresse postale *</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" required placeholder="123 Main Street" />
                    </FormControl>
                    <FormDescription>
                      (( Indiquez le nom exact de votre propriété pour que nous puissions vous
                      envoyer des colis depuis le script La Poste. ))
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField v-slot="{ value }" name="district">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>District *</FormLabel>
                    <Select
                      :model-value="value"
                      @update:model-value="
                        (v) => {
                          if (v && v !== 'null') {
                            form.setFieldValue('district', v as GTA5DistrictId)
                          } else {
                            form.setFieldValue('district', undefined)
                          }
                        }
                      "
                      required
                    >
                      <FormControl>
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Sélectionnez un district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="null" :disabled="!value"> N/A </SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Los Santos</SelectLabel>
                          <SelectItem
                            v-for="lsDistrict of getLSDistricts().toSorted((a, b) =>
                              a.label.localeCompare(b.label)
                            )"
                            :value="lsDistrict.id"
                          >
                            {{ lsDistrict.label }}
                          </SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Autre ville/district</SelectLabel>
                          <SelectItem
                            v-for="lsDistrict of getNorthDistricts().toSorted((a, b) =>
                              a.label.localeCompare(b.label)
                            )"
                            :value="lsDistrict.id"
                          >
                            {{ lsDistrict.label }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Church class="w-5 h-5" />
              Paroisse et religion
            </h3>
            <div class="grid md:grid-cols-2 gap-4">
              <FormField v-slot="{ componentField }" name="baptized">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Êtes-vous baptisé ? *</FormLabel>
                    <Select v-bind="componentField" required>
                      <FormControl>
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Sélectionnez une réponse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          v-for="option in [
                            { id: 'yes', label: 'Oui' },
                            { id: 'no', label: 'Non' },
                            { id: 'unsure', label: 'Je ne suis pas sûr' },
                          ]"
                          :key="option.id"
                          :value="option.id"
                        >
                          {{ option.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="religion">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Religion *</FormLabel>
                    <Select v-bind="componentField" required>
                      <FormControl>
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Sélectionnez une réponse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem
                          v-for="religion in CATHOLIC_OR_OTHER"
                          :key="religion.id"
                          :value="religion.id"
                        >
                          {{ religion.label }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="parish">
                <FormItem>
                  <div class="space-y-2">
                    <FormLabel>Paroisse *</FormLabel>
                    <Select v-bind="componentField" required>
                      <FormControl>
                        <SelectTrigger class="w-full">
                          <SelectValue placeholder="Sélectionnez une paroisse" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem v-for="parish in parishes" :key="parish.id" :value="parish.id">
                          {{ parish.name }}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Indiquez une paroisse de l'archidiocèse. En général, on indique la paroisse la
                      plus proche de son domicile.
                    </FormDescription>
                    <FormMessage />
                  </div>
                </FormItem>
              </FormField>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">Informations sur le foyer</h3>

            <FormFieldArray v-slot="{ fields, push, remove }" name="familyMembers">
              <FormItem>
                <div class="space-y-4">
                  <div>
                    <Label>Membres du foyer</Label>
                    <p class="text-sm text-muted-foreground mt-1">
                      Ajoutez les membres de votre foyer qui s'inscriront avec vous (conjoint,
                      enfants, etc.)
                    </p>
                  </div>

                  <Empty
                    v-if="fields?.length === 0"
                    class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg"
                  >
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <Users />
                      </EmptyMedia>
                      <EmptyTitle>Aucun membre du foyer ajouté</EmptyTitle>
                      <EmptyDescription>
                        Cliquez sur "Ajouter un membre" pour commencer
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>

                  <!-- <div
                    v-if="fields?.length === 0"
                    class="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg"
                  >
                    <Users class="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Aucun membre du foyer ajouté</p>
                    <p class="text-sm">Cliquez sur "Ajouter un membre" pour commencer</p>
                  </div> --->

                  <div v-else class="space-y-4">
                    <Card v-for="(entry, idx) in fields" :key="entry.key" class="relative">
                      <CardContent class="pt-6">
                        <div class="absolute top-4 right-4">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            @click="remove(idx)"
                            class="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <span class="sr-only">Supprimer</span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            >
                              <path d="M18 6 6 18" />
                              <path d="m6 6 12 12" />
                            </svg>
                          </Button>
                        </div>

                        <div class="grid md:grid-cols-2 gap-4 pr-10">
                          <FormField
                            v-slot="{ componentField }"
                            :name="`familyMembers[${idx}].firstname`"
                          >
                            <FormItem>
                              <div class="space-y-2">
                                <FormLabel>Prénom *</FormLabel>
                                <FormControl>
                                  <Input v-bind="componentField" required placeholder="Prénom" />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          </FormField>

                          <FormField
                            v-slot="{ componentField }"
                            :name="`familyMembers[${idx}].lastname`"
                          >
                            <FormItem>
                              <div class="space-y-2">
                                <FormLabel>Nom de famille *</FormLabel>
                                <FormControl>
                                  <Input
                                    v-bind="componentField"
                                    required
                                    placeholder="Nom de famille"
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          </FormField>

                          <FormField
                            v-slot="{ componentField }"
                            :name="`familyMembers[${idx}].age`"
                          >
                            <FormItem>
                              <div class="space-y-2">
                                <FormLabel>Âge *</FormLabel>
                                <FormControl>
                                  <Input
                                    v-bind="componentField"
                                    type="number"
                                    min="0"
                                    max="120"
                                    placeholder="Âge"
                                    required
                                  />
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          </FormField>

                          <FormField
                            v-slot="{ componentField }"
                            :name="`familyMembers[${idx}].role`"
                          >
                            <FormItem>
                              <div class="space-y-2">
                                <FormLabel>Rôle dans le foyer *</FormLabel>
                                <Select v-bind="componentField" required>
                                  <FormControl>
                                    <SelectTrigger class="w-full">
                                      <SelectValue placeholder="Sélectionner un rôle" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem
                                      v-for="role in HOUSEHOLD_ROLES"
                                      :key="role.id"
                                      :value="role.id"
                                    >
                                      {{ role.label }}
                                    </SelectItem>
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </div>
                            </FormItem>
                          </FormField>
                        </div>

                        <FormField
                          v-slot="{ value, handleChange }"
                          type="checkbox"
                          :name="`familyMembers[${idx}].isNpc`"
                        >
                          <FormItem class="flex flex-row items-center gap-x-2 mt-2">
                            <FormControl>
                              <Checkbox :model-value="value" @update:model-value="handleChange" />
                            </FormControl>
                            <div class="space-y-1 leading-none">
                              <FormLabel class="inline text-sm">
                                (( C'est un personnage non-joueur (PNJ) ))
                              </FormLabel>
                              <FormMessage />
                            </div>
                          </FormItem>
                        </FormField>
                      </CardContent>
                    </Card>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    :disabled="fields.length >= 5"
                    @click="
                      push({
                        firstname: '',
                        lastname: '',
                        age: 0,
                        role: undefined as unknown as undefined,
                        isNpc: false,
                      })
                    "
                    class="w-full gap-2"
                  >
                    <Users class="w-4 h-4" />
                    Ajouter un membre du foyer
                  </Button>
                </div>
                <ErrorMessage
                  id="familyMembersError"
                  data-slot="form-message"
                  as="p"
                  :name="toValue('familyMembers')"
                  class="text-destructive text-sm"
                />
              </FormItem>
            </FormFieldArray>
          </div>

          <FormField v-slot="{ componentField }" name="message">
            <FormItem>
              <div class="space-y-4">
                <FormLabel class="text-lg font-semibold text-gray-900">
                  Informations complémentaires
                </FormLabel>
                <div class="space-y-2">
                  <FormControl>
                    <Textarea
                      v-bind="componentField"
                      placeholder="Écrire ici..."
                      :rows="4"
                      :max="300"
                    />
                  </FormControl>
                  <FormDescription>
                    Facultatif. Vous pouvez ajouter tout ce que vous avez envie de nous transmettre
                    : à propos de vous, de votre foyer, de vos besoins, ...
                  </FormDescription>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          </FormField>

          <Separator />

          <div class="space-y-4">
            <h3 class="text-lg font-semibold text-gray-900">(( Partie OOC ))</h3>
            <p class="text-sm text-gray-600">
              Cette partie est avant tout pour nous, pour avoir des informations sur vos personnages
              qu'en tant qu'Église nous sommes censés posséder.
            </p>

            <FormField v-slot="{ componentField }" name="characterSacraments">
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>Votre personnage a reçu les sacrements de...</FormLabel>
                  <Select v-bind="componentField" multiple>
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Sélectionnez des sacrements" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem
                        v-for="sacrament in INDIVIDUAL_SACRAMENTS"
                        :key="sacrament.id"
                        :value="sacrament.id"
                        :disabled="isCharacterSacramentDisabled(sacrament)"
                      >
                        {{ sacrament.label }}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription class="text-muted-foreground text-xs">
                    <p>
                      Cochez ce que votre personnage a bien reçu dans son histoire passée. Ça nous
                      permet de jouer nos archives et registres !
                    </p>
                    <Typography variant="list" class="mt-0">
                      <li>
                        Baptême : si votre personnage a été baptisé dans son histoire passée (par
                        ex, quand il était enfant)
                      </li>
                      <li>
                        Première communion : si votre personnage baptisé a fait sa première
                        communion dans son histoire passée
                      </li>
                      <li>
                        Confirmation : si votre personnage a reçu le sacrement de la confirmation
                        dans son histoire passée (au début de l'adolescence ou plus tard)
                      </li>
                    </Typography>
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>

            <FormField v-slot="{ componentField }" name="oocAdditionalInformation">
              <FormItem>
                <div class="space-y-2">
                  <FormLabel>
                    Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP
                    sur votre personnage ?
                  </FormLabel>
                  <FormControl>
                    <Textarea v-bind="componentField" :max="700" rows="3" />
                  </FormControl>
                  <FormDescription class="text-muted-foreground text-sm">
                    Laissez vide si rien ou si vous ne souhaitez pas partager d'informations.
                    Soumettez uniquement des informations qui devraient déjà être sues en RP par le
                    clergé de l'archidiocèse de Los Santos.
                  </FormDescription>
                  <FormMessage />
                </div>
              </FormItem>
            </FormField>
          </div>

          <div class="flex justify-end pt-6 border-t">
            <Button
              type="submit"
              size="lg"
              :disabled="isSubmitting || isValidating || meta.pending || !meta.valid || !meta.dirty"
            >
              <template v-if="isSubmitting">
                <LoaderCircle class="animate-spin" />
                Soumission...
              </template>
              <template v-else>Soumettre l'enregistrement</template>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>

    <div class="mt-8 text-center text-sm text-muted-foreground">
      <p>
        Vos informations resteront confidentielles et ne seront utilisées que pour la correspondance
        et les services des paroisses.
      </p>
      <p class="mt-2">Des questions ? <LinkText route="contact">Contactez-nous</LinkText></p>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { LoaderCircle, Church, MapPin, Users, Heart, PhoneCall } from 'lucide-vue-next'
import { LinkText } from '@/components/ui/LinkText'
import Head from '@/components/AppHead.vue'
import PageBanner from '@/components/layout/PageBanner.vue'
import { Typography } from '@/components/ui/typography'
import {
  getLSDistricts,
  getNorthDistricts,
  type GTA5DistrictId,
} from '#shared/constants/districts.constants'
import { parishes } from '@/constants/parishes.constants'
import {
  CATHOLIC_OR_OTHER,
  CIVIL_TITLES,
  GENDERS,
  HOUSEHOLD_ROLES,
  INDIVIDUAL_SACRAMENTS,
  type IndividualSacrament,
  MARITAL_STATUS,
} from '#shared/constants/person.constants'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/components/ui/number-field'
import { useCurrentCharacter } from '@/composables/use_current_character'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import AuthentificationRequiredAlert from '@/components/AuthentificationRequiredAlert.vue'
import { useUser } from '@/composables/use_user'
import { ErrorMessage, useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { registerParishionerSchema } from '@/validations/register_parishioner.schema'
import { router } from '@inertiajs/vue3'
import { toast } from 'vue-sonner'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormFieldArray,
} from '@/components/ui/form'
import { tuyau } from '@/lib/tuyau'
import { Checkbox } from '@/components/ui/checkbox'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { LOCAL_ETHNICS_COMMUNITIES } from '#shared/constants/ethnicity.constants'
import { toValue } from 'vue'
import { usePageProps } from '@/composables/use_page_props'
import { useErrors } from '@/composables/use_errors'

const props = usePageProps()
const errors = useErrors()
const user = useUser()
const currentCharacter = useCurrentCharacter()

const form = useForm({
  validationSchema: toTypedSchema(registerParishionerSchema),
  initialValues: {
    recordType: 'new',
    civilTitle: undefined,
    maritalStatus: undefined,
    firstname: currentCharacter.value?.firstname || '',
    lastname: currentCharacter.value?.lastname || '',
    gender: undefined,
    age: undefined,
    ethnicCommunity: 'none',
    occupation: '',
    phone: '',
    emergencyPhone: '',
    address: '',
    district: undefined,
    baptized: undefined,
    religion: undefined,
    parish: undefined,
    familyMembers: [],
    message: '',
    characterSacraments: [],
    oocAdditionalInformation: '',
  },
})

const { isFieldDirty, isSubmitting, isValidating, meta } = form

const onSubmit = form.handleSubmit((formValues) => {
  router.post(tuyau['register-parishioner'].$url(), formValues, {
    preserveScroll: true,
    preserveState: true,
    onSuccess: () => {
      if (props.value.success) {
        form.resetForm()
        return toast.success('Succès !', {
          description: props.value.success || 'Soumis avec succès !',
        })
      }
      toast.error(errors.value.E_REGISTER_PARISHIONER_ERROR || 'Une erreur est survenue.')
    },
    onError: (err) => {
      if (err) {
        if (!('E_REGISTER_PARISHIONER_ERROR' in err)) {
          form.setErrors(err)
          return toast.error('Champs invalides', {
            description: 'Veuillez corriger les erreurs dans le formulaire',
          })
        }

        toast.error('Échec', { description: err.E_REGISTER_PARISHIONER_ERROR })
      }
    },
  })
})

const isCharacterSacramentDisabled = (sacrament: IndividualSacrament) => {
  const selected = form.values.characterSacraments || []

  const missingRequired =
    sacrament.required.length > 0 && !sacrament.required.every((req) => selected.includes(req))

  const isRequiredByOther = selected.some((selectedId) => {
    const selectedSacrament = INDIVIDUAL_SACRAMENTS.find((s) => s.id === selectedId)
    return selectedSacrament?.required.includes(sacrament.id)
  })

  return (!selected.includes(sacrament.id) && missingRequired) || isRequiredByOther
}
</script>
