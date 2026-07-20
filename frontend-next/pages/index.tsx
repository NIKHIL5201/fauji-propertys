import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const Home: React.FC = () => {
  const sampleProperties = [
    { id: 'fp-001', title: 'Elegant 3 BHK in Kidwai Nagar', slug: 'elegant-3bhk-kidwai-nagar', price: '55 Lakh' },
    { id: 'fp-002', title: 'Premium Villa near LDA Colony', slug: 'premium-villa-lda', price: '1.25 Crore' },
  ]

  return (
    <>
      <Head>
        <title>Fauji Propertys — Trusted Property Dealer in Kanpur</title>
        <meta name="description" content="Buy, sell, rent premium properties in Kanpur. Trusted property dealer." />
      </Head>
      <main style={{padding: 24, fontFamily: 'Inter, system-ui'}}>
        <header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h1>Fauji Propertys</h1>
          <nav>
            <Link href="/">Home</Link> {' | '}
            <Link href="/contact">Contact</Link>
          </nav>
        </header>

        <section style={{marginTop: 24}}>
          <h2>Featured Properties</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16}}>
            {sampleProperties.map(p => (
              <article key={p.id} style={{border: '1px solid #eee', borderRadius: 12, padding: 12}}>
                <div style={{height: 160, background: '#f3f3f5', borderRadius: 8}} />
                <h3 style={{marginTop: 12}}>{p.title}</h3>
                <p style={{color: '#444', fontWeight: 600}}>{p.price}</p>
                <Link href={`/property/${p.slug}`}>View</Link>
              </article>
            ))}
          </div>
        </section>

      </main>
    </>
  )
}

export default Home
