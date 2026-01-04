import { Layout } from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";

const credits = [
  { song: "i'll never forgive you", artist: "Angelo Mota", album: "i changed my mind" },
  { song: "Keep Me Around", artist: "AUGUST 08", album: "Keep Me Around - Single" },
  { song: "Fefifo", artist: "aubreykingx", album: "Pregame - EP" },
  { song: "I Now Know.", artist: "Ausar", album: "I Now Know." },
  { song: "poster CHILD", artist: "Ausar, Dende, Sam Williams & Selah St. Sabina Youth Choir", album: "I Now Know." },
  { song: "PLEAsure", artist: "Ausar, Senite", album: "I Now Know." },
  { song: "Win", artist: "Ausar, Tri Nohbi", album: "I Now Know." },
  { song: "Missing You", artist: "BJRNCK", album: "A Girl Like Me" },
  { song: "Hold Back Tears", artist: "Conway the Machine", album: "You Can't Kill God With Bullets" },
  { song: "Bornstar (feat. Bratzbih)", artist: "DETO BLACK", album: "Bornstar (feat. Bratzbih) - Single" },
  { song: "Shmurda Talk (feat. Rowdy Rebel)", artist: "Doe Boy", album: "Shmurda Talk (feat. Rowdy Rebel) - Single" },
  { song: "Grown", artist: "Dom Sarfo", album: "Grown - Single" },
  { song: "6AM", artist: "Fee4Three", album: "6AM - Single" },
  { song: "Earth is The Trap", artist: "Fee4Three", album: "Earth is TheTrap" },
  { song: "Finally, I Vent", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Gossip", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Tabernacle", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "Useless II", artist: "Fee4Three", album: "Epitome of Balance" },
  { song: "On God (feat. KayCyy)", artist: "Fivio Foreign", album: "B.I.B.L.E." },
  { song: "B Word Demo", artist: "Foggieraw", album: "Fogtavious Vandross 2" },
  { song: "Street", artist: "G Herbo", album: "Humble Beast" },
  { song: "balance", artist: "Garrett Zoukis", album: "ZOU" },
  { song: "Red Eye", artist: "Gnarly Brown", album: "Orange Rose - EP" },
  { song: "Add Gin (feat. Niko the Great)", artist: "Gnarly Brown, Fee4Three", album: "5 Songs - EP" },
  { song: "B******t (feat. Niko the Great)", artist: "Gnarly Brown, Fee4Three", album: "5 Songs - EP" },
  { song: "FRITO LAY", artist: "isaiah Rusk", album: "Happily Ever AFTRs - EP" },
  { song: "Common Ground", artist: "Jack Harlow", album: "Jackman." },
  { song: "Abundance", artist: "Jay2", album: "Send Heartss" },
  { song: "Arm N Leg (feat. Bari)", artist: "Jay2", album: "Send Heartss" },
  { song: "Stay In", artist: "Jay2", album: "Send Heartss" },
  { song: "GOLDTOOTH (feat. Blaqbonez)", artist: "Knucks", album: "A Fine African Man" },
  { song: "No Angel", artist: "Lei Dominique", album: "No Angel - Single" },
  { song: "Adderall", artist: "Loe Shimmy, Fredo Bang", album: "Zombieland 2.6" },
  { song: "Walk By Faith (feat. Josh Kream)", artist: "Maxo Kream", album: "Personification" },
  { song: "Ball", artist: "Michael Christmas", album: "Role Model" },
  { song: "Butler (feat. Maceo & Aaliyah Allah)", artist: "Myquale", album: "Heard Well Collection, Vol. 18" },
  { song: "& Then There Were Two", artist: "myquale", album: "Above All" },
  { song: "Above All (feat. KETU & Denzel Lavell)", artist: "myquale", album: "Above All" },
  { song: "fortyfour4's", artist: "myquale", album: "fortyfour4's - Single" },
  { song: "Isolation", artist: "myquale", album: "Isolation - Single" },
  { song: "North (feat. Trapo)", artist: "myquale", album: "North (feat. Trapo) - Single" },
  { song: "Hold Me Close", artist: "Nali", album: "No Spaces - Single" },
  { song: "Thokoza (feat. ASAP Shembe)", artist: "NLite.", album: "Remix - EP" },
  { song: "Alone in LA", artist: "Oranj Goodman", album: "Alone in LA - Single" },
  { song: "Evol", artist: "Outernet", album: "Evol - Single" },
  { song: "PEARLS", artist: "Devin Malik", album: "DEADSTOCK" },
  { song: "Luv Me Back", artist: "PHABO", album: "Before I Let Her Go - EP" },
  { song: "Palm Trees", artist: "PHABO", album: "Soulquarius" },
  { song: "Zoo (feat. Elton Aura)", artist: "Qari", album: "Igotproblems - EP" },
  { song: "GRAND CHERRY", artist: "Reuben Vincent", album: "GRAND CHERRY - Single" },
  { song: "Chase tha Bag", artist: "Roddy Ricch", album: "Feed tha Streets" },
  { song: "Hmm", artist: "Seddy Hendrinx, Quay Global", album: "BLITZ" },
  { song: "Mr. DJ", artist: "Tahjer", album: "Mr. DJ - Single" },
  { song: "Out of Respect", artist: "Teezo Touchdown", album: "How Do You Sleep At Night? With You" },
  { song: "Bad Habits", artist: "The Other Eric", album: "Bad Habits - Single" },
  { song: "Best Mistake (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Blown Away", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Cut Off", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Cut Off", artist: "The Other Eric", album: "Cut Off - Single" },
  { song: "Felt This Way", artist: "The Other Eric", album: "Felt This Way - Single" },
  { song: "Let Me Down (feat. Chanelle Truvillion)", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Like This (Version 1)", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Overblown (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Purest (feat. Niko The Great)", artist: "The Other Eric", album: "Broken Cookies - Single" },
  { song: "Tell Nobody", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "Tell Nobody", artist: "The Other Eric", album: "Tell Nobody - Single" },
  { song: "Temporary", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "The Plug", artist: "The Other Eric", album: "The Plug - Single" },
  { song: "You Know Better", artist: "The Other Eric", album: "Conflict Perspective" },
  { song: "THREW MY LIFE AWAY", artist: "Tweetsie Baby", album: "THREW MY LIFE AWAY - Single" },
  { song: "BETHLEHEM/SC FREESTYLE", artist: "VIC MENSA", album: "V TAPE" },
  { song: "Call Her Bae", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Frosty (feat. Jay2)", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Got Weight", artist: "Young Pink", album: "Neva Look Back" },
  { song: "In the Mix", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Make Em Sick", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Outlaw", artist: "Young Pink", album: "Neva Look Back" },
  { song: "Set Fire", artist: "Young Pink", album: "F*@k It... Burn It All Down" },
  { song: "Can't Be Saved", artist: "YoungBoy Never Broke Again", album: "4Respect 4Freedom 4Loyalty 4WhatImportant" },
  { song: "Genie", artist: "YoungBoy Never Broke Again", album: "Until Death Call My Name Reloaded" },
];

const Credits = () => {
  return (
    <Layout showMarquee={false}>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Production Credits
          </h1>
          <p className="text-muted-foreground text-lg mb-6">
            Music produced, co-produced, or featuring Niko The Great
          </p>
          <a
            href="https://music.apple.com/us/playlist/prod-by-niko-the-great/pl.u-KVXBDR1FdvNq88"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary neon-glow-sm hover:underline"
          >
            View on Apple Music
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-border bg-muted/50">
              <span className="text-muted-foreground text-sm">Song</span>
              <span className="text-muted-foreground text-sm">Artist</span>
              <span className="text-muted-foreground text-sm">Album</span>
            </div>
            
            <div className="divide-y divide-border">
              {credits.map((credit, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/30 transition-colors">
                  <span className="font-medium text-foreground">{credit.song}</span>
                  <span className="text-muted-foreground">{credit.artist}</span>
                  <span className="text-muted-foreground truncate">{credit.album}</span>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-border bg-muted/50 text-center">
              <span className="text-primary neon-glow-sm font-semibold">{credits.length} Total Placements</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Credits;