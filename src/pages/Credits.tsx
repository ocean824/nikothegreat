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
  { song: "Fuck Yo DJ", artist: "Dej Loaf & Jacquees", album: "Fuck Yo DJ - Single" },
  { song: "Want The Smoke", artist: "ChriseanRock", album: "Big Bussiness" },
  { song: "Moonrocks (feat. Lil Yachty)", artist: "Yung Bans", album: "Misunderstood" },
  { song: "Drippin In Designer", artist: "Autumn!", album: "The Arrival" },
  { song: "Broke No Mo (feat. Yung Bans & Lightshow)", artist: "Lil Gotit", album: "I Luv Everything" },
  { song: "Flex Up", artist: "Lil Gotit", album: "Top Chef Gotit" },
  { song: "Designer Talk", artist: "Lil Gotit", album: "Superstar Creature" },
  { song: "Pop My Shit", artist: "Lil Gotit", album: "Hood Baby 2" },
  { song: "Drip 2 Hard", artist: "Lil Baby & Gunna", album: "Drip Harder" },
  { song: "Real As It Gets", artist: "Lil Baby & EST Gee", album: "My Turn (Deluxe)" },
  { song: "Woah", artist: "Lil Baby", album: "My Turn" },
  { song: "Sum 2 Prove", artist: "Lil Baby", album: "My Turn" },
  { song: "Emotionally Scarred", artist: "Lil Baby", album: "My Turn" },
  { song: "Grace", artist: "Lil Baby & 42 Dugg", album: "My Turn (Deluxe)" },
  { song: "We Paid", artist: "Lil Baby & 42 Dugg", album: "My Turn (Deluxe)" },
  { song: "No Sucker", artist: "Lil Baby & Moneybagg Yo", album: "Street Gossip" },
  { song: "Pure Cocaine", artist: "Lil Baby", album: "Harder Than Ever" },
  { song: "Global", artist: "Lil Baby", album: "Street Gossip" },
  { song: "Freestyle", artist: "Lil Baby", album: "Street Gossip" },
  { song: "Time", artist: "Gunna", album: "Wunna" },
  { song: "Dollaz On My Head", artist: "Gunna & Young Thug", album: "Wunna" },
  { song: "Skybox", artist: "Gunna", album: "Wunna" },
  { song: "Pushin P", artist: "Gunna & Future ft. Young Thug", album: "DS4EVER" },
  { song: "Private Island", artist: "Gunna", album: "DS4EVER" },
  { song: "Banking On Me", artist: "Gunna", album: "DS4EVER" },
  { song: "Poochie Gown", artist: "Gunna", album: "Drip Season 4" },
  { song: "Too Easy", artist: "Gunna & Future", album: "DS4EVER" },
  { song: "Empire", artist: "Gunna", album: "Drip Season 3" },
  { song: "3 Headed Snake", artist: "Gunna & Young Thug", album: "Drip or Drown 2" },
  { song: "Richard Millie Plain", artist: "Gunna", album: "Drip Season 3" },
  { song: "Same Yung N*gga", artist: "Gunna", album: "Drip or Drown" },
  { song: "Oh Okay", artist: "Gunna & Young Thug ft. Lil Baby", album: "Drip or Drown 2" },
  { song: "Speed It Up", artist: "Gunna", album: "Drip or Drown 2" },
  { song: "Baby Birkin", artist: "Gunna", album: "Wunna" },
  { song: "Blindfold", artist: "Gunna", album: "Wunna" },
  { song: "Rockstar Bikers & Chains", artist: "Gunna", album: "Wunna (Deluxe)" },
  { song: "Livin Wild", artist: "Gunna", album: "Wunna (Deluxe)" },
  { song: "Met Gala", artist: "Gunna & Young Thug", album: "Punk" },
  { song: "Ski", artist: "Young Thug", album: "So Much Fun" },
  { song: "Hot", artist: "Young Thug ft. Gunna", album: "So Much Fun" },
  { song: "Just How It Is", artist: "Young Thug", album: "So Much Fun" },
  { song: "Millions", artist: "Young Thug", album: "Punk" },
  { song: "Tick Tock", artist: "Young Thug", album: "Punk" },
  { song: "Die Slow", artist: "Young Thug", album: "Punk" },
  { song: "Hate The Game", artist: "Young Thug", album: "Punk" },
  { song: "Peepin Out The Window", artist: "Young Thug & Future ft. BSlime", album: "Punk" },
  { song: "Bubbly", artist: "Young Thug ft. Drake & Travis Scott", album: "Punk" },
  { song: "Road Rage", artist: "Young Thug", album: "Business Is Business" },
  { song: "Oh U Went", artist: "Young Thug & Drake", album: "Punk" },
  { song: "Stressed", artist: "Young Thug ft. J. Cole & T-Shyne", album: "Punk" },
];

const Credits = () => {
  return (
    <Layout showMarquee={false}>
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            <span className="text-primary neon-glow-sm">Production Credits</span>
          </h1>
          <p className="text-muted-foreground text-lg mb-2">
            Music produced, co-produced, or featuring Niko The Great
          </p>
          <p className="text-primary neon-glow-sm text-2xl font-bold mb-6">
            {credits.length} Credits
          </p>
          <a
            href="https://music.apple.com/library/playlist/p.mmRl3ZAfvVYGqq"
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
            <div className="grid grid-cols-3 gap-4 p-4 border-b border-border bg-muted text-muted-foreground text-sm font-medium">
              <span>Song</span>
              <span>Artist</span>
              <span>Album</span>
            </div>
            
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {credits.map((credit, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 p-4 hover:bg-muted/50 transition-colors">
                  <span className="font-medium text-foreground">{credit.song}</span>
                  <span className="text-primary neon-glow-sm">{credit.artist}</span>
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