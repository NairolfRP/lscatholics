import z from 'zod'
import { PARISH_VALUES } from '../constants/parish'

export const parishIdSchema = z.enum(PARISH_VALUES)
