import { Layout } from "@/components/layout/Layout";
import { ExternalLink } from "lucide-react";

const credits = [
  { song: "Street", artist: "G Herbo", album: "Humble Beast" },
  { song: "Genie", artist: "YoungBoy Never Broke Again", album: "Until Death Call My Name Reloaded" },
  { song: "Can't Be Saved", artist: "YoungBoy Never Broke Again", album: "4Respect 4Freedom 4Loyalty 4WhatImportant" },
  { song: "Chase tha Bag", artist: "Roddy Ricch", album: "Feed tha Streets" },
  { song: "Common Ground", artist: "Jack Harlow", album: "Jackman." },
  { song: "On God (feat. KayCyy)", artist: "Fivio Foreign", album: "B.I.B.L.E." },
  { song: "Walk By Faith (feat. Josh Kream)", artist: "Maxo Kream", album: "Personification" },
  { song: "Hold Back Tears", artist: "Conway the Machine", album: "You Can't Kill God With Bullets" },
  { song: "BETHLEHEM/SC FREESTYLE", artist: "VIC MENSA", album: "V TAPE" },
  { song: "Shmurda Talk (feat. Rowdy Rebel)", artist: "Doe Boy", album: "Shmurda Talk - Single" },
  { song: "Adderall", artist: "Loe Shimmy, Fredo Bang", album: "Zombieland 2.6" },
  { song: "GOLDTOOTH (feat. Blaqbonez)", artist: "Knucks", album: "A Fine African Man" },
  { song: "Palm Trees", artist: "PHABO", album: "Soulquarius" },
  { song: "Luv Me Back", artist: "PHABO", album: "Before I Let Her Go - EP" },
  { song: "Ball", artist: "Michael Christmas", album: "Role Model" },
  { song: "Out of Respect", artist: "Teezo Touchdown", album: "How Do You Sleep At Night? With You" },
  { song: "Keep Me Around", artist: "AUGUST 08", album: "Keep Me Around - Single" },
  { song: "Hmm", artist: "Seddy Hendrinx, Quay Global", album: "BLITZ" },
  { song: "GRAND CHERRY", artist: "Reuben Vincent", album: "GRAND CHERRY - Single" },
  { song: "PEARLS", artist: "Devin Malik", album: "DEADSTOCK" },
  { song: "i'll never forgive you", artist: "Angelo Mota", album: "i changed my mind" },
  { song: "Bornstar (feat. Bratzbih)", artist: "Desiigner", album: "Bornstar - Single" },
  { song: "BLESS UP (feat. Kodie Shane)", artist: "Nessly", album: "Still Finessin" },
  { song: "Love Letter (feat. Trippie Redd)", artist: "Nessly", album: "Still Finessin" },
  { song: "Ramen Noodles (feat. B La B)", artist: "Yung Bans", album: "Misunderstood" },
  { song: "Dej Loaf & Jacquees", artist: "Fuck Yo DJ", album: "Fuck Yo DJ - Single" },
  { song: "Want The Smoke", artist: "ChriseanRock", album: "Big Bussiness" },
  { song: "Moonrocks (feat. Lil Yachty)", artist: "Yung Bans", album: "Misunderstood" },
  { song: "Drippin In Designer", artist: "Autumn!", album: "The Arrival" },
  { song: "Broke No Mo (feat. Yung Bans & Lightshow)", artist: "Lil Gotit", album: "I Luv Everything" },
];

const Credits = () => {
  return (
    <Layout showMarquee={false}>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">Production Credits</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Music produced, co-produced, or featuring Niko The Great
          </p>
          <a
            href="https://music.apple.com/library/playlist/p.mmRl3ZAfvVYGqq"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            View on Apple Music
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-border bg-muted text-muted-foreground text-sm font-medium">
              <span>Song</span>
              <span>Artist</span>
              <span>Album</span>
            </div>
            
            <div className="divide-y divide-border">
              {credits.map((credit, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground">{credit.song}</span>
                  <span className="text-muted-foreground">{credit.artist}</span>
                  <span className="text-muted-foreground truncate">{credit.album}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Credits;
