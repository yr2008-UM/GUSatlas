export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Citation Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Citation</h2>
          <div className="space-y-2 text-gray-800">
            <p>MGM</p>
            <p>cross-cohort GUS</p>
          </div>
        </section>

        {/* Release News Section */}
        <section className="mb-12">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h2 className="text-3xl font-bold mb-2 text-gray-900">GUSatlas V1.0 Released</h2>
            <p className="text-gray-700">(30 Jun 2025)</p>
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-800 mb-6">
              We are pleased to announce the release of GUSatlas V1.0.
              This release marks the initial version of GUSatlas. In this version, the homepage bar includes three main functions: Browse, Tools, and Download.
            </p>

            {/* Browse Function */}
            <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Browse Function</h3>
            <p className="text-gray-800 mb-4">In the Browse function, we provide three datasets:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-800">
              <li>GUS550: Derived from our published manuscript[1], based on a CRC cohort comprising 571 samples.</li>
              <li>GUS707: Also from our published manuscript[2], based on seven CRC cohorts with a total of 1,359 samples.</li>
              <li>GUSref114: Additionally from our manuscript[1], used as a reference for GUS identification.</li>
            </ul>

            {/* Tool Function */}
            <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Tool Function</h3>
            <p className="text-gray-800 mb-4">In the Tool section, we offer three tools, including:</p>
            <div className="space-y-6 pl-6 border-l-2 border-gray-200">
              <div className="relative">
                <div className="absolute -left-[28px] top-[12px] w-4 h-[2px] bg-gray-200"></div>
                <h4 className="font-semibold text-lg text-gray-900">BLAST against GUS Sequences</h4>
                <p className="text-gray-800">
                  Input your amino acid sequences, select your preferred GUS reference (from GUS550, GUS707, or GUSref114), and set the BLAST parameters. You can then view and download the BLAST results.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[28px] top-[12px] w-4 h-[2px] bg-gray-200"></div>
                <h4 className="font-semibold text-lg text-gray-900">GUS Identification</h4>
                <p className="text-gray-800">
                  GUSs are identified from the input amino acid sequences based on the following criteria:
                </p>
                <ul className="list-disc pl-6 mt-2 space-y-2 text-gray-800">
                  <li>High similarity to 114 GUS reference proteins with > 25% sequence and E values below 0.05 by blastp (Version 2.12.0+, default parameters)</li>
                  <li>Containing all three architectural domains of GUS enzymes (PF02836, PF02837 and PF00703)[3] by hmmsearch (Version 3.3.2, default parameters) with E values below 0.05</li>
                  <li>Preserving the essential and specific active-site residues for bacterial GUSs, including the N and Y motif, NxKG motif and catalytic E residues[4]</li>
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -left-[28px] top-[12px] w-4 h-[2px] bg-gray-200"></div>
                <h4 className="font-semibold text-lg text-gray-900">Loop Classification</h4>
                <p className="text-gray-800">
                  The loop classification of input GUSs is determined as previously described[4]. Briefly, by using clustalO (Version 1.2.3, default parameters), multiple sequence alignment was conducted based on the input gmGUS proteins and eight references with NCBI accession numbers WP_005931592.1, NP_416134.1, WP_012740861.1, WP_005639106.1, WP_004298526.1, pdb|3CMG|A, WP_035447612.1 and WP_007841259.1. Then, loop category for each gmGUS was determined by the length of Loop 1 region and Loop 2 region as shown below.
                </p>
              </div>
            </div>

            {/* Download Function */}
            <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">Download Function</h3>
            <p className="text-gray-800 mb-8">
              You can download the features of GUS550, GUS707, and GUSref114, as well as the metadata and abundance profiles of the included samples.
            </p>

            {/* References */}
            <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-900">References</h3>
            <div className="space-y-2 text-sm text-gray-800">
              <p>[1] MGM</p>
              <p>[2] cross-cohort GUS</p>
              <p>[3] Talens-Perales, D., et al., Analysis of Domain Architecture and Phylogenetics of Family 2 Glycoside Hydrolases (GH2). PLoS One, 2016. 11(12): p. e0168035.</p>
              <p>[4] Pollet, R.M., et al., An Atlas of beta-Glucuronidases in the Human Intestinal Microbiome. Structure, 2017. 25(7): p. 967-+.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
