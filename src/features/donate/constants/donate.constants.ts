export const DONATION_MIN_AMOUNT = 200

/** Hard cap enforced by the Fleeca gateway (documentation). */
export const FLEECA_MAX_AMOUNT = 99_999_999

export const PREDEFINED_AMOUNTS = [100_000, 50_000, 20_000, 10_000, 5_000] as const

export const DONATION_SOURCE = 'donation'

export const FLEECA_STANDING_ORDER_IBAN = '0200 1914 4'

export const PAYMENT_POPUP_CONFIG = {
  width: 800,
  height: 800,
  timeoutMs: 15 * 60 * 1000,
  closeCheckIntervalMs: 1000,
} as const

export const recurringDonationSteps = [
  {
    title: 'Connectez-vous à votre espace en ligne Fleeca',
    description: "Accédez à l'application web de votre banque depuis le navigateur du jeu.",
  },
  {
    title: 'Ouvrez la page « Virement Récurrent »',
    description:
      'Sélectionnez le compte source puis cliquez sur « AJOUTER NOUVEAU » pour créer un nouveau virement récurrent.',
  },
  {
    title: 'Renseignez les informations du don',
    description:
      "Indiquez le montant, l'IBAN ci-dessous, le type de répétition et la date de début.",
  },
  {
    title: 'Confirmez votre don',
    description:
      'Ajoutez « Donation » dans les remarques puis cliquez sur « CONFIRMER » pour enregistrer votre don périodique.',
  },
] as const
