import React from 'react'
import Head from 'next/head'
import { GetStaticPaths, GetStaticProps } from 'next'

type PropertyProps = {
  slug: string
}

const PropertyPage: React.FC<PropertyProps> = ({ slug }) => {
  return (
    <>
      <Head>
        <title>Property — {slug} | Fauji Propertys</title>
        <meta name="description" content={`Details for property ${slug}`} />
      </Head>
      <main style={{padding: 24}}>
        <h1>Property: {slug}</h1>
        <p>Property detail skeleton — images, gallery, price, description, map and contact CTAs will go here.</p>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // For scaffolding we return no paths; ISR or on-demand rendering will be used in production
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const slug = ctx.params?.slug as string
  // Fetch property by slug from API or DB in real implementation
  return { props: { slug } }
}

export default PropertyPage
