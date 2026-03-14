import Head from '@/shared/components/app-head'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { LinkText } from '@/shared/components/link-text'
import HeroSection from '@/shared/components/layout/default/hero-section'
import { Container } from '@/shared/components/ui/container'

export default function PrivacyPage() {
  return (
    <>
      <Head title="Politique de confidentialité" />

      <HeroSection align="text-left" bgColor="bg-linear-to-r from-primary to-catholic-blue">
        <h1 className="text-4xl text-white font-bold">(( Politique de confidentialité ))</h1>
      </HeroSection>

      <Container
        size="prose"
        spacing="lg"
        className="prose prose-neutral lg:prose-lg dark:prose-invert text-justify"
      >
        <Alert variant="info" className="mb-5">
          <AlertDescription>
            Contrairement au reste de l'application, cette page n'est pas fictive. Elle décrit les
            données réelles collectées et traitées par cette application.
          </AlertDescription>
        </Alert>

        <h2>Préambule</h2>
        <p>
          Cette application a été créée pour la faction{' '}
          <span className="font-bold">Archidiocèse de Los Santos</span>, un projet de jeu de rôle
          (roleplay) sur le serveur de jeu{' '}
          <LinkText external href="https://gta.world/" target="_blank">
            GTA World
          </LinkText>
          . Il n'est ni affilié ni un produit officiel de la marque GTA World. Cette politique de
          confidentialité explique comment nous collectons, utilisons et protégeons vos données
          personnelles conformément au Règlement (UE) 2016/679 du 27 avril 2016 (RGPD) et à la Loi
          informatique et Libertés du 6 janvier 1978.
        </p>

        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement de vos données est le créateur et développeur de cette
          application. Pour toute question, vous pouvez le contacter via Discord :{' '}
          <span className="font-bold">nairolf.rp</span> ou par{' '}
          <LinkText
            external
            href="https://forum-fr.gta.world/profile/11040-nairolf/"
            target="_blank"
          >
            messagerie privée
          </LinkText>{' '}
          sur le forum GTA World.
        </p>

        <h2>2. Données collectées</h2>
        <p>
          Notre application collecte les informations minimales et nécessaires pour son
          fonctionnement :
        </p>
        <ul>
          <li>
            <strong>Identifiants GTA World :</strong> Votre nom d'utilisateur, votre identifiant
            unique et la liste de vos personnages en jeu, fournis lors de l'authentification via l'
            <LinkText
              external
              href="https://forum.gta.world/en/topic/141258-gta-world-oauth-api-documentation-updated-march-1st-2025/"
              target="_blank"
            >
              API de GTA World
            </LinkText>
          </li>
          <li>
            <strong>Tokens d'authentification :</strong> Tokens d'accès et de rafraîchissement
            nécessaires pour maintenir votre session connectée
          </li>
          <li>
            <strong>Données Discord (optionnelles) :</strong> Si vous choisissez de lier votre
            compte Discord, nous collectons les informations minimales (identifiant et pseudonyme)
          </li>
        </ul>

        <h2>3. Tiers et Sous-Traitants</h2>
        <p>
          Vos données personnelles ne sont jamais vendues, partagées, ni louées à des tiers à des
          fins commerciales ou marketing.
        </p>
        <p>
          Les seules entités ayant accès à vos données sont les partenaires techniques
          indispensables au fonctionnement de l'application, listés ci-dessous :
        </p>
        <ul>
          <li>
            <strong>
              <LinkText external href="https://global.gta.world/privacy" target="_blank">
                GTA World
              </LinkText>
            </strong>{' '}
            : Fournisseur d'authentification OAuth. Vos identifiants et données de compte sont gérés
            par leur API et infrastructure
          </li>
          <li>
            <strong>
              <LinkText external href="https://umami.is/privacy" target="_blank">
                Umami Analytics
              </LinkText>
            </strong>{' '}
            : Collecte des données analytiques anonymisées sur votre navigation (pas de collecte
            d'informations personnelles)
          </li>
          <li>
            <strong>
              <LinkText external href="https://turso.tech/privacy-policy" target="_blank">
                Turso
              </LinkText>
            </strong>{' '}
            : Hébergeur de base de données qui stocke vos identifiants localement (infrastructure
            chiffrée)
          </li>
          <li>
            <strong>
              <LinkText external href="https://render.com/privacy" target="_blank">
                Render.com
              </LinkText>
            </strong>{' '}
            : Hébergeur de l'application web
          </li>
        </ul>
        <p>
          <strong>Important :</strong> Consultez les politiques de confidentialité de ces tiers pour
          comprendre comment ils traitent vos données.
        </p>

        <h2>4. Analyse avec Umami</h2>
        <p>
          Nous utilisons{' '}
          <LinkText external href="https://umami.is/" target="_blank">
            Umami
          </LinkText>
          , un outil d'analytique respectueux de la vie privée. Umami collecte des données
          anonymisées sur votre navigation (pages visitées, temps de visite, appareil){' '}
          <strong>sans</strong> collecter d'informations personnelles identifiantes. Aucun cookie
          n'est utilisé pour cela. Consultez la{' '}
          <LinkText external href="https://umami.is/privacy" target="_blank">
            politique de confidentialité d'Umami
          </LinkText>{' '}
          pour plus de détails.
        </p>

        <h2>5. Utilisation des données</h2>
        <p>Vos données sont utilisées exclusivement pour :</p>
        <ul>
          <li>Vous authentifier et maintenir votre session connectée</li>
          <li>Gérer et personnaliser votre compte utilisateur</li>
          <li>Identifier votre rôle et vos permissions</li>
        </ul>

        <h2>6. Conservation des données</h2>
        <ul>
          <li>
            <strong>Données d'authentification :</strong> Conservées tant que votre compte existe.
            Vous pouvez demander la suppression de votre compte et de toutes vos données associées à
            tout moment.
          </li>
          <li>
            <strong>Tokens d'accès :</strong> Rafraîchis lors de chaque connexion. Les anciens
            tokens expirent automatiquement après leur date d'expiration.
          </li>
        </ul>

        <h2>7. Sécurité des données</h2>
        <p>Nous mettrons en place les mesures de sécurité suivantes pour protéger vos données :</p>
        <ul>
          <li>Communications chiffrées en HTTPS/TLS</li>
          <li>Base de données chiffrée chez Turso</li>
          <li>Authentification OAuth2 sécurisée (délégation à GTA World)</li>
          <li>Tokens d'authentification chiffrés avant stockage</li>
        </ul>
        <p>
          Cependant, aucun système n'est 100% sécurisé. Nous vous recommandons de maintenir la
          confidentialité de votre mot de passe GTA World et de ne pas le partager. En cas de doute,
          changez votre mot de passe sur la plateforme de GTA World et révoquez les sessions
          actives. Nous ne serons pas responsables des accès non autorisés résultant de la
          compromission de vos identifiants GTA World.
        </p>

        <h2>8. Vos droits</h2>
        <p>
          Conformément aux réglementations européennes et françaises en vigueur, vous disposez d'un
          droit d'accès, de rectification et d'effacement de vos données.
        </p>
        <ul>
          <li>
            <strong>Suppression immédiate</strong> : Vous pouvez à tout moment supprimer
            instantanément votre compte et les données associées depuis vos paramètres de compte.
            Cette action ne peut pas être annulée.
          </li>
          <li>
            <strong>Accès aux données</strong> : Vous pouvez demander à voir quelles données nous
            avons collectées sur vous.
          </li>
          <li>
            <strong>Données GTA World :</strong> Pour les informations provenant de votre compte GTA
            World, vous devez les gérer directement sur leur plateforme.
          </li>
          <li>
            <strong>Autre demande :</strong> Pour toute question, contactez le responsable du
            traitement mentionné ci-dessus (section 1).
          </li>
        </ul>

        <h2>9. Cookies et technologies similaires</h2>
        <p>
          Notre application utilise des cookies de session pour maintenir votre authentification et
          votre connexion. Ces cookies sont nécessaires au fonctionnement de l'application et ne
          contiennent pas d'informations personnelles sensibles au-delà de votre identifiant de
          session.
        </p>

        <h2>10. Modifications de cette politique</h2>
        <p>
          Cette politique de confidentialité peut être mise à jour à tout moment pour refléter les
          changements de nos pratiques, de la législation ou des services tiers utilisés. La date de
          dernière mise à jour est visible en bas de cette page.
        </p>

        <p className="mt-10 text-sm text-gray-500">
          <strong>Dernière mise à jour :</strong> 13 mars 2026
        </p>
      </Container>
    </>
  )
}
