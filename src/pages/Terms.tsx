import { Layout } from "@/components/layout/Layout";

const Terms = () => {
  return (
    <Layout showMarquee={false}>
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <p className="text-muted-foreground mb-4">nikothegreatbeatz@gmail.com</p>
        
        <h1 className="text-3xl font-bold text-foreground mb-6">
          NIKO THE GREAT TERMS OF USE
        </h1>

        <h2 className="text-xl font-bold text-foreground mb-4">
          NIKO THE GREAT MASTER USE LICENSE AGREEMENT
        </h2>

        <p className="text-primary mb-6">(Effective Upon Purchase or Download)</p>

        <div className="prose prose-invert max-w-none space-y-6 text-secondary-foreground">
          <p>
            This Master Use License Agreement ("Agreement") is entered into by and between 
            Sample Society, LLC ("Licensor"), acting on behalf of its affiliated producers, 
            composers, and sound designers (collectively, the "Creators"), and the purchaser 
            or user ("Licensee" or "Client").
          </p>

          <p>
            By purchasing, downloading, or otherwise obtaining any sound recordings, compositions, 
            or sample packs ("Materials") from Sample-Society.com, Licensee agrees to be legally 
            bound by the terms of this Agreement.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">1. GRANT OF LICENSE</h3>

          <p>
            Licensor hereby grants to Licensee a non-exclusive, non-transferable, worldwide license 
            to use the Materials in Licensee's own musical and audiovisual works, subject to the 
            following terms:
          </p>

          <h4 className="font-semibold mt-6 mb-2">
            (a) Compositions, Stems, Multi-Kits, Construction Kits, and Drum Breaks ("Master Use Materials")
          </h4>

          <p>
            Licensee may incorporate these Materials into new musical works for commercial release, 
            placement, or synchronization. Licensee must give credit on derivative works to the named 
            Creator(s) as "Producer," "Co-Producer," or "Contains sample(s) by "Creator(s)" Ex: 
            "Co-Prod by [Creator Name]"; the creator(s) name will be provided on every kit. Licensee 
            must provide the Creator(s) a fair and equal publishing share/revenue split on resale of 
            derivative works utilizing the materials (default: even share off associated advances, fees, 
            writer's, and publisher's, split unless otherwise specified: contact nikothegreatbeatz@gmail.com 
            for Revenue Split/PRO information). Licensee must ensure that Creator(s) are properly registered 
            with applicable performing rights organizations (PROs) for all distributed works containing 
            these Materials. contact nikothegreatbeatz@gmail.com for Revenue Split/PRO information). 
            These Materials are not royalty-free; they require proper attribution and publishing participation. 
            In case of placement using the sample(s), you will split the publishing, royalties, mechanicals, 
            points & advance fees with the Creator(s) fairly and Production (or Co-Production) or sample 
            attribution must be credited to the Creator(s).
          </p>

          <h4 className="font-semibold mt-6 mb-2">
            (b) One-Shots, Midi-Kits, and Sound Banks ("Royalty-Free Materials")
          </h4>

          <p>
            Licensee may freely use individual sounds, drum hits, FX, Midi, or other one-shot samples 
            in new compositions without credit, royalties, or publishing splits. Royalty-Free Materials 
            may not be resold, redistributed, or included in new sample packs, libraries, or virtual 
            instruments. Licensee owns full creative rights to works incorporating these sounds, subject 
            only to the restriction above.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">2. RESTRICTIONS</h3>

          <p>Licensee shall NOT:</p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Resell, sublicense, redistribute, or otherwise transfer any raw Materials in their original or modified form.</li>
            <li>Include Materials in any sample pack, sound library, virtual instrument, or similar product intended for resale or distribution.</li>
            <li>Claim copyright ownership of the raw Materials.</li>
            <li>Use Materials in projects that defame, harm, or violate applicable law.</li>
          </ul>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">3. OWNERSHIP</h3>

          <p>
            All ownership, copyright, and intellectual property rights in and to the Materials remain 
            solely with Sample Society, LLC and/or its Creators. Licensee acquires only the limited 
            rights set forth in this Agreement.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">4. WARRANTIES & DISCLAIMERS</h3>

          <p>
            THE MATERIALS ARE PROVIDED "AS IS." LICENSOR MAKES NO WARRANTIES, EXPRESS OR IMPLIED, 
            INCLUDING BUT NOT LIMITED TO MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. 
            LICENSOR SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL 
            DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE USE OF THE MATERIALS.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">5. INDEMNIFICATION</h3>

          <p>
            Licensee agrees to indemnify and hold harmless Sample Society, LLC, its Creators, and 
            affiliates from any claims, damages, or liabilities arising from Licensee's misuse or 
            unauthorized use of the Materials.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">6. TERMINATION</h3>

          <p>
            This License is effective until terminated. Licensor may terminate the Agreement immediately 
            upon written notice if Licensee breaches any term. Upon termination, Licensee must cease 
            all use of the Materials and destroy any copies in their possession.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">7. GOVERNING LAW</h3>

          <p>
            This Agreement shall be governed by and interpreted under the laws of the state of Georgia, 
            USA. Any disputes shall be resolved in the courts located in Fulton County, Georgia.
          </p>

          <h3 className="text-primary text-lg font-semibold mt-8 mb-4">8. ENTIRE AGREEMENT</h3>

          <p>
            This Agreement constitutes the entire understanding between Licensor and Licensee. 
            Any amendments or modifications must be in writing and signed by both parties.
          </p>

          <p className="mt-8">
            For licensing inquiries, custom usage rights, or additional terms, please contact:
          </p>

          <p className="text-primary">nikothegreatbeatz@gmail.com</p>
        </div>
      </section>
    </Layout>
  );
};

export default Terms;
