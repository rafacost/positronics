# Study model for docs/study-emc-atomic-number.md: EMC per stratum, current tier values vs Z x tier factor.
Z = dict(H=1,Li=3,Be=4,C=6,O=8,F=9,Na=11,Mg=12,Al=13,Si=14,S=16,Cl=17,K=19,Ca=20,Ti=22,V=23,Cr=24,Mn=25,Fe=26,Co=27,Ni=28,Cu=29,Zn=30,Ga=31,As=33,Ag=47,Sn=50,Sb=51,Au=79,Pb=82,Th=90,U=92)
# element tier, as in emc.js
T = {e:1 for e in Z}
for e in ['Li','Al','Ga','As','Ag','Sb','Au']: T[e]=2
for e in ['Ti','V','Cr','U','Th']: T[e]=3
NOW = {1:8,2:64,3:512}
F = {1:1,2:8,3:64}
dust = {
 'Fe':{'Fe':1},'Ni':{'Ni':1},'Mn':{'Mn':1},'Cu':{'Cu':1},'Au':{'Au':1},'Co':{'Co':1},'Sn':{'Sn':1},'Zn':{'Zn':1},
 'Sb':{'Sb':1},'coal':{'C':1},'S':{'S':1},'Pb':{'Pb':1},'Ag':{'Ag':1},'Ga':{'Ga':1},'As':{'As':1},'Li':{'Li':1},'Mg':{'Mg':1},
 'bauxite':{'Al':2,'O':3},'SiO2':{'Si':1,'O':2},'NaCl':{'Na':1,'Cl':1},'KCl':{'K':1,'Cl':1},'FeS2':{'Fe':1,'S':2},
 'TiO2':{'Ti':1,'O':2},'FeTiO3':{'Fe':1,'Ti':1,'O':3},'FeCr2O4':{'Fe':1,'Cr':2,'O':4},'VFe3O4':{'V':1,'Fe':3,'O':4},
 'Fe3O4':{'Fe':3,'O':4},'diamond':{'C':1},'emerald':{'Be':3,'Al':2,'Si':6,'O':18},'Al2O3':{'Al':2,'O':3},
 'ruby':{'Al':2,'O':3,'Cr':1},'spodumene':{'Li':1,'Al':1,'Si':2,'O':6},'lepidolite':{'K':1,'Li':3,'Al':4,'F':2,'O':10},
 'topaz':{'Al':2,'Si':1,'F':2,'H':2,'O':6},'CaCO3':{'Ca':1,'C':1,'O':3},'oil':{'C':1,'H':2},'pitch':{'U':3,'Th':1,'Pb':1,'O':6},'UO2':{'U':1,'O':2},
}
tiers = {
1:[(.4,'Fe',[('Ni',.1),('Mn',.05)]),(.3,'Cu',[('Au',.05),('Co',.03)]),(.22,'Sn',[('Zn',.1),('Sb',.03)]),(.25,'coal',[('coal',.05),('S',.08)]),(.1,'Pb',[('Ag',.05)]),(.08,'Ni',[('Co',.05)])],
2:[(.25,'bauxite',[('Ga',.05),('TiO2',.03)]),(.22,'SiO2',[('SiO2',.2)]),(.1,'Ga',[('As',.5)]),(.12,'Au',[('Ag',.2)]),(.14,'NaCl',[('Li',.05),('KCl',.15)]),(.1,'S',[('FeS2',.2)]),(.06,'Sb',[('Co',.1)]),(.1,'SiO2',[('SiO2',.3)])],
3:[(.22,'TiO2',[('FeTiO3',.2)]),(.14,'FeCr2O4',[('Mg',.1)]),(.1,'VFe3O4',[('Fe3O4',.2)]),(.1,'diamond',[('emerald',.1),('Al2O3',.1),('ruby',.1)]),(.1,'spodumene',[('lepidolite',.2)]),(.08,'topaz',[('CaCO3',.2)]),(.16,'oil',[('coal',.2)]),(.05,'pitch',[('UO2',.2)])],
}
def val(d, f):  # value of one dust = 16 atoms split by formula
    n = sum(d.values()); return 16*sum(c/n*f(e) for e,c in d.items())
now = lambda e: NOW[T[e]]
zt = lambda e: Z[e]*F[T[e]]
STAR = {1:('Core I  Klein Zwei',200e3),2:('Core II Klein Vier',3.2e6),3:('Core III Klein Omega',51.2e6)}
base_now = base_z = None
for t,mix in tiers.items():
    W = sum(w for w,_,_ in mix); a=b=0
    print(f'--- Seed {t}')
    for w,m,by in mix:
        vn = val(dust[m],now)+sum(p*val(dust[x],now) for x,p in by)
        vz = val(dust[m],zt)+sum(p*val(dust[x],zt) for x,p in by)
        a+=w*vn; b+=w*vz
        print(f'   {m:10} now {vn:8.0f}  ZxF {vz:8.0f}  x{vz/vn:5.2f}')
    a/=W; b/=W
    name,s = STAR[t]
    print(f'  AVG per stratum: now {a:.0f}  ZxF {b:.0f}  (x{b/a:.2f});  {name}: strata needed now {s/a:,.0f}  ZxF {s/b:,.0f}')
