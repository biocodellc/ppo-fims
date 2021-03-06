# Stardog implementation
Running stardog on an Ubuntu (16.04) server under port 5820, using an apache reverse proxy to change incoming requests on port 80 to 5820.   Installation is at: /opt/stardog/stardog-4.2.  Note: start and stop scripts like (%stardog-admin server {start|stop})

# Test Data

Following two files used for my tests (one is the ontology, with all ontologies referenced by the application ontology merged into a single new ontology and then saved as n3 format. The purpose of this step is to easily load all of the information we need into StarDog ):
  * The ontology, based on the [PPO Application ontology] (https://raw.githubusercontent.com/biocodellc/ppo-fims/master/data/ontology/ppo_ingest.owl), has been processed in Protege by downloading all relevant source code and then exported in one unit to: https://raw.githubusercontent.com/biocodellc/ppo-fims/master/data/ontology/ppo_ingest_reasoned.n3
  * The instance data, represent a very minimal example of what we want to do is found here: 
  https://raw.githubusercontent.com/biocodellc/ppo-fims/master/data/ontology/data_pheno_paper_test.n3

# Notes on Reasoners

To test that what i want to do works in Protege, I first loaded the Test Data into protege, and then formulated the following under the "DL Query" Tab with the Fact++ reasoner turned on and checking the "instance data" box:
```
'whole plant' that 'participates in' some 'vascular leaf phenological stage'
```
which gave me the expected result that plant1 and plant2 particpate in the 'vascular leaf phenological stage'

My next task is to replicate the above results using stardog.

Stardog supports OWL EL, RL, SL, QL, and DL.  The following are my results in experiment with each of these.

Then, i loaded them into their own namespace, using a different reasoner each time i load the data.
```
stardog-admin db create -n pheno_paper_test -o reasoning.type=QL -- ppo_ingest.n3
stardog data add pheno_paper_test data_pheno_paper_test.n3
```

Next step was to try a query on one of my test instance plants:
```
refix dwc:     <http://rs.tdwg.org/dwc/terms/>
prefix rdf:     <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix owl:     <http://www.w3.org/2002/07/owl#>
prefix rdfs:    <http://www.w3.org/2000/01/rdf-schema#>
prefix ark:     <http://biscicol.org/id/ark:>
prefix obo:     <http://purl.obolibrary.org/obo/>

select ?p ?o ?objectlabel {
   <http://biscicol.org/test/?plant1> ?p ?o .
   optional {?o rdfs:label ?objectlabel}
}
``` 
Results for this query with reasoning off:
```
ppo:~/unzipped_data$ stardog query pheno_paper_test  stardog_query.sparql  
+-------------------------------------------+-------------------------------------------+---------------------------------------+
|                     p                     |                     o                     |              objectlabel              |
+-------------------------------------------+-------------------------------------------+---------------------------------------+
| rdf:type                                  | http://purl.obolibrary.org/obo/PO_0000003 | "whole plant"                         |
| http://purl.obolibrary.org/obo/RO_0000086 | urn:traitInstanceClass=1                  | "instance of leaves present (trait1)" |
| rdfs:label                                | "plant1"                                  |                                       |
+-------------------------------------------+-------------------------------------------+---------------------------------------+

Query returned 3 results in 00:00:00.206
```
So far, so good.  Now lets try the reasoning:

Results for this query by reasoner:
   * EL and SL do not work
   * DL times out
   * RL is super slow (returns the same results as QL)
   * QL is fast but does not return what we expect.
   -  returns superclasses but does not infer plant stages as happened when we were working with Fact++ in protege.
```
ppo:~/unzipped_data$ stardog query pheno_paper_test  -r stardog_query.sparql  
+-------------------------------------------+-------------------------------------------+---------------------------------------+
|                     p                     |                     o                     |              objectlabel              |
+-------------------------------------------+-------------------------------------------+---------------------------------------+
| rdf:type                                  | owl:Thing                                 |                                       |
| rdf:type                                  | http://purl.obolibrary.org/obo/PO_0000003 | "whole plant"                         |
| rdf:type                                  | http://purl.obolibrary.org/obo/PO_0009011 | "plant structure"                     |
| http://purl.obolibrary.org/obo/RO_0000086 | urn:traitInstanceClass=1                  | "instance of leaves present (trait1)" |
| http://purl.obolibrary.org/obo/RO_0000053 | urn:traitInstanceClass=1                  | "instance of leaves present (trait1)" |
| rdfs:label                                | "plant1"                                  |                                       |
+-------------------------------------------+-------------------------------------------+---------------------------------------+

Query returned 6 results in 00:00:01.028
```

So, a few questions following all of this:
  * Why does DL time out... This, i'm not too surprised i guess.. full DL support not really meant for triples, but there are only 14 distinct triples i'm testing with.
  * Next question, is why aren't any of the other reasoner options working... When i tested with QL, here is what the logs say:
  https://github.com/biocodellc/ppo-fims/blob/master/data/ontology/stardog.log  ... The errors in the log are perhaps clues as to what may be going on...
  

