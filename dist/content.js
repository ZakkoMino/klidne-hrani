export const MAX_LEVELS={memory:3,helper:2,story:3,search:3,stop:1,sort:3,path:3,rhythm:2};
export const VERSION='1.0.0';
export const GAMES=[
 {id:'memory',name:'Zvířátka na návštěvě',short:'Zapamatuj si cestu',emoji:'🦊',color:'blue',area:'Paměť',intro:'Podívej, kam jde liška. Potom klepni na stejné domečky ve stejném pořadí.',offline:'Položte čtyři velké karty. Dotkněte se dvou po sobě a nechte dítě zopakovat pořadí.'},
 {id:'helper',name:'Pomocník se zvířátky',short:'Poslechni a pomoz',emoji:'🐻',color:'yellow',area:'Porozumění',intro:'Poslechni si zadání. Klepni na předmět a potom na zvířátko, kterému ho dáš.',offline:'Použijte známé předměty: „Dej lžíci na stůl.“ Později přidejte druhý známý krok.'},
 {id:'story',name:'Co bylo potom?',short:'Poskládej příběh',emoji:'📖',color:'pink',area:'Příběhy',intro:'Podívej se na obrázky. Klepni nejdřív na to, co se stalo první, a potom na další obrázky.',offline:'Povídejte si o dnešním zážitku. Kdo tam byl? Co se stalo první? Ukázání je také odpověď.'},
 {id:'search',name:'Klidný detektiv',short:'Najdi stejný obrázek',emoji:'🔎',color:'mint',area:'Pozornost',intro:'Nahoře je obrázek, který hledáš. Najdi stejný mezi obrázky dole.',offline:'Položte tři až pět předmětů na stůl. Společně hledejte jeden z nich.'},
 {id:'stop',name:'Semafor pro vláček',short:'Někdy počkej',emoji:'🚂',color:'pink',area:'Čekání',intro:'Zelené kolečko s prstem znamená klepnout. Červená značka s dlaní znamená počkat.',offline:'Hrajte pohybové „sochy“. Předem si ukážte signál, na který se zastavíte.'},
 {id:'sort',name:'Třídírna pokladů',short:'Najdi správnou krabičku',emoji:'🧩',color:'mint',area:'Pravidla',intro:'Podívej se na pravidlo nahoře. Dej tvar do správné krabičky. Pravidlo ti vždy ukážeme.',offline:'Roztřiďte velké kostky podle barvy. Změnu na třídění podle tvaru výslovně ukažte.'},
 {id:'path',name:'Cesta za pokladem',short:'Nejdřív vymysli cestu',emoji:'🗺️',color:'yellow',area:'Plánování',intro:'Vyber šipky, které dovedou lišku k pokladu. Potom cestu společně vyzkoušíme.',offline:'Na podlaze označte tři místa. Vymyslete dva kroky k cíli a potom je projděte.'},
 {id:'rhythm',name:'Rytmický parťák',short:'Zatleskej si spolu',emoji:'👏',color:'blue',area:'Rytmus',intro:'Poslechni si rytmus. Pak odložte tablet a zopakujte ho společně. Rodič označí, jak se vám hrálo.',offline:'Dospělý předvede dvě tlesknutí nebo doteky stehen. Dítě zopakuje. Obrazovku můžete odložit.'}
];
export const ITEMS=[{id:'apple',emoji:'🍎',name:'jablko'},{id:'carrot',emoji:'🥕',name:'mrkev'},{id:'banana',emoji:'🍌',name:'banán'},{id:'ball',emoji:'⚽',name:'míč'}];
export const ANIMALS=[{id:'bear',emoji:'🐻',name:'medvěd',to:'medvědovi'},{id:'rabbit',emoji:'🐰',name:'králík',to:'králíkovi'},{id:'fox',emoji:'🦊',name:'liška',to:'lišce'}];
export const ICONS=[...ITEMS,...ANIMALS,{id:'cup',emoji:'☕',name:'hrnek'},{id:'car',emoji:'🚗',name:'auto'},{id:'tree',emoji:'🌳',name:'strom'},{id:'fish',emoji:'🐟',name:'ryba'},{id:'sun',emoji:'☀️',name:'slunce'}];
export const STORIES=[
 ['Voda na stole',['Sklenice se převrhla.','Vezmeme utěrku.','Utřeme stůl.'],'Co se stalo první?','Co nám pomůže utřít vodu?'],
 ['Čisté ruce',['Ruce jsou špinavé.','Umyjeme si ruce.','Osušíme si ruce.'],'Co uděláme po umytí?','Proč si ruce myjeme?'],
 ['Malá rostlinka',['Zasadíme semínko.','Semínko zalijeme.','Vyroste rostlinka.'],'Co vyrostlo?','Co rostlinka potřebuje?'],
 ['Venku prší',['Za oknem prší.','Obujeme si holínky.','Jdeme ven do louže.'],'Co si obujeme?','Proč jsme si vzali holínky?'],
 ['Svačina',['Máme banán.','Banán oloupeme.','Banán sníme.'],'Co uděláme před jídlem?','Proč banán loupeme?'],
 ['Dárek',['Dostali jsme zabalený dárek.','Dárek rozbalíme.','Uvnitř je medvídek.'],'Co bylo v dárku?','Jak jsme zjistili, co je uvnitř?'],
 ['Věž',['Kostky leží na stole.','Stavíme věž.','Věž je hotová.'],'Co jsme postavili?','Co jsme potřebovali na věž?'],
 ['Obrázek',['Vezmeme papír a pastelky.','Kreslíme obrázek.','Ukážeme hotové sluníčko.'],'Co je na obrázku?','Čím jsme kreslili?'],
 ['Žíznivý pejsek',['Pejsek má prázdnou misku.','Nalijeme do misky vodu.','Pejsek se napije.'],'Co pejsek pije?','Proč jsme nalili vodu?'],
 ['Uklízíme',['Hračky leží na zemi.','Dáme je do krabice.','Pokoj je uklizený.'],'Kam patří hračky?','Proč jsme uklízeli?'],
 ['Chleba se sýrem',['Připravíme chleba a sýr.','Dáme sýr na chleba.','Svačinu sníme.'],'Co jsme dali na chleba?','Co jsme potřebovali na svačinu?'],
 ['Dobrou noc',['Připravíme pyžamo.','Oblékneme si pyžamo.','Jdeme spát.'],'Co si oblékneme?','Co uděláme před spaním?']
].map((s,i)=>({id:'story-'+i,title:s[0],sentences:s[1],question:s[3],simpleQuestion:s[2],atlas:Math.floor(i/4)+1,row:i%4}));
export const AUDIO_TEXTS={ready:'Teď ty.',correct:'Povedlo se.',retry:'Zkusíme to spolu.',break:'Dáme si pauzu. Odlož tablet a rozhlédni se kolem sebe.',end:'Pro dnešek máme hotovo. Děkuji za společné hraní.',look:'Podívej, kam jde liška.',same:'Najdi stejný obrázek.',go:'Teď klepni.',wait:'Teď počkej.',color:'Teď třídíme podle barvy.',shape:'Teď třídíme podle tvaru.',path:'Vyber cestu k pokladu.',rhythm:'Poslechni si rytmus a potom ho společně zopakujte.',okay:'Je mi dobře.',pause:'Chci pauzu.',finish:'Chci skončit.',unsure:'Nevím.'};
for(const g of GAMES)AUDIO_TEXTS['intro-'+g.id]=g.intro;
for(const i of ITEMS)for(const a of ANIMALS)AUDIO_TEXTS[`give-${i.id}-${a.id}`]=`Dej ${i.name} ${a.to}.`;
for(const x of ICONS)AUDIO_TEXTS['word-'+x.id]=x.name;
for(const s of STORIES){s.sentences.forEach((x,i)=>AUDIO_TEXTS[s.id+'-'+i]=x);AUDIO_TEXTS[s.id+'-q']=s.question;AUDIO_TEXTS[s.id+'-simple']=s.simpleQuestion;}
AUDIO_TEXTS.then='Potom';
