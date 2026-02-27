import { test } from '@japa/runner'
import { createDonateFormValidator } from '#donate/validators/donate'

test.group('Donate Form Validator', () => {
  test('should validate complete valid donation form', async ({ assert }) => {
    const validData = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      age: 25,
      ethnicity: 'white',
      phone: '123456',
      address: '123 Main Street, Downtown',
      district: 'downtown_los_santos',
      isOrganization: false,
      organizationName: undefined,
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.doesNotReject(async () => {
      return await createDonateFormValidator.validate(validData)
    })
  })

  test('should validate minimal required fields only', async ({ assert }) => {
    const minimalData = {
      amount: 200,
      firstname: 'J',
      lastname: 'D',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.doesNotReject(async () => {
      return await createDonateFormValidator.validate(minimalData)
    })
  })

  test('should fail validation for amount below minimum', async ({ assert }) => {
    const invalidData = {
      amount: 199, // Below minimum of 200
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    const result = await createDonateFormValidator.tryValidate(invalidData)

    assert.deepInclude(result[0]?.messages, {
      field: 'amount',
      message: 'Le montant minimum pour un don est de 200$.',
      rule: 'min',
      meta: { min: 200 },
    })
  })

  test('should fail validation for decimal amounts', async ({ assert }) => {
    const invalidData = {
      amount: 250.5,
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    const result = await createDonateFormValidator.tryValidate(invalidData)

    assert.deepInclude(result[0]?.messages, {
      field: 'amount',
      message: 'Le montant doit être un nombre entier valide.',
      rule: 'withoutDecimals',
    })
  })

  test('should fail validation for missing required fields', async ({ assert }) => {
    const invalidDatas = [
      {
        amount: 1000,
        lastname: 'Doe',
        isOrganization: false,
        anonymous: false,
        fleecaConfirmation: true,
      },
      {
        amount: 1000,
        firstname: 'John',
        isOrganization: false,
        anonymous: false,
        fleecaConfirmation: true,
      },
      {
        amount: 1000,
        firstname: 'John',
        lastname: 'Doe',
        isOrganization: false,
        anonymous: false,
      },
    ]

    for (const data of invalidDatas) {
      assert.rejects(async () => await createDonateFormValidator.validate(data))
    }
  })

  test('should validate age boundaries', async ({ assert }) => {
    const baseData = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.doesNotReject(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          age: 16,
        })
    )

    await assert.doesNotReject(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          age: 120,
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          age: 15,
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          age: 121,
        })
    )
  })

  test('should validate phone number format', async ({ assert }) => {
    const baseData = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    const validPhones = ['123', '1234567', '12345678', '123 456', '12 34 56']

    for (const phone of validPhones) {
      await assert.doesNotReject(
        async () =>
          await createDonateFormValidator.validate({
            ...baseData,
            phone,
          })
      )
    }

    const invalidPhones = ['12', '123456789', 'abc123', '123-456-789']

    for (const phone of invalidPhones) {
      await assert.rejects(
        async () =>
          await createDonateFormValidator.validate({
            ...baseData,
            phone,
          })
      )
    }
  })

  test('should validate address and district relationship', async ({ assert }) => {
    const baseData = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          address: '123 Main Street, Downtown',
        })
    )

    await assert.doesNotReject(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          address: '123 Main Street, Downtown',
          district: 'downtown_los_santos',
        })
    )
  })

  test('should validate organization fields', async ({ assert }) => {
    const baseData = {
      amount: 1000,
      firstname: 'John',
      lastname: 'Doe',
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          isOrganization: true,
        })
    )

    await assert.doesNotReject(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          isOrganization: true,
          organizationName: 'ACME Corporation',
        })
    )

    await assert.doesNotReject(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          isOrganization: false,
        })
    )
  })

  test('should validate string length limits', async ({ assert }) => {
    const baseData = {
      amount: 1000,
      isOrganization: false,
      anonymous: false,
      fleecaConfirmation: true,
    }

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          firstname: '',
          lastname: 'Doe',
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          firstname: 'a'.repeat(51),
          lastname: 'Doe',
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          firstname: 'John',
          lastname: '',
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          firstname: 'John',
          lastname: 'b'.repeat(51),
        })
    )

    await assert.rejects(
      async () =>
        await createDonateFormValidator.validate({
          ...baseData,
          firstname: 'John',
          lastname: 'Doe',
          address: 'Too short',
          district: 'downtown_los_santos',
        })
    )
  })
})
