/*****************************************************************************
 *  VuokraVaiOma.fi JavaScript
 *  Copyright (C) 2014 Jaakko Luttinen
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU Affero General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU Affero General Public License for more details.
 *
 *   You should have received a copy of the GNU Affero General Public License
 *   along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *****************************************************************************/

function update() {
    // Lue parametrit
    var paaoma = document.getElementById('paaoma').value * 1.0;
    var hinta = document.getElementById('hinta').value * 1.0;
    var korko = document.getElementById('korko').value / 100.0;
    var aika = document.getElementById('aika').value * 1.0;
    var vastike = document.getElementById('vastike').value * 1.0;
    var asuntomuutos = 1.0 + document.getElementById('asuntomuutos').value / 100.0;
    var vastikemuutos = 1.0 + document.getElementById('vastikemuutos').value / 100.0;
    var vuokramuutos = 1.0 + document.getElementById('vuokramuutos').value / 100.0;
    
    var vuokra = document.getElementById('vuokra').value * 1.0;
    var tuotto = 1.0 + document.getElementById('tuotto').value / 100.0;

    // Laske lainan suuruus
    if (hinta > paaoma)
        var laina = hinta - paaoma;
    else
        var laina = 0;

    // Laske annuiteetti
    if (aika > 0) {
        var kasvukerroin = Math.pow(1+korko, aika)
        if (korko > 0)
            var annuiteetti = kasvukerroin * korko / (kasvukerroin - 1) * laina;
        else if (korko == 0)
            var annuiteetti = laina / aika;
    }
    else {
        // VIRHEILMOITUS
        var annuiteetti = laina;
    }

    var sijoitukset = paaoma;

    var vastikekk = vastike;
    var vuokrakk = vuokra;
    var lainakulukk = annuiteetti / 12.0;
    var vastikemuutoskk = Math.pow(vastikemuutos, 1.0/12);
    var vuokramuutoskk = Math.pow(vuokramuutos, 1.0/12);
    var tuottokk = Math.pow(tuotto, 1.0/12);

    // Iteraatio
    for (var vuosi = 0; vuosi < aika; vuosi++)
    {
        for (var kuukausi = 0; kuukausi < 12; kuukausi++)
        {
            // Kuukausikulu omistusasumisessa
            var omistuskulukk = lainakulukk + vastikekk;

            // Sijoitettava summa vuokralla asuessa
            var saastokk = omistuskulukk - vuokrakk;
            sijoitukset += saastokk;

            // Hintojen muutokset
            vuokrakk *= vuokramuutoskk;
            vastikekk *= vastikemuutoskk;

            if (sijoitukset >= 0)
            {
                // Sijoitusten kasvu
                sijoitukset *= tuottokk;
            }
            else
            {
                // Varoitus. Vuokralla asuja käyttää enemmän rahaa. Vertailu ei
                // ole raha koska tämä tappio ei kasva korkoa.
            }
        }
    }

    // Laske omistusasujan pääoma
    var omistuspaaoma = 0;
    if (paaoma > hinta)
        omistuspaaoma = paaoma - hinta;
    // Asunnon arvon kehitys
    hinta *= Math.pow(asuntomuutos, aika);
    omistuspaaoma += hinta;

    // Laske vuokralla asujan pääoma
    var vuokrapaaoma = sijoitukset;

    // Näytä tunnusluvut
    document.getElementById("laina").innerHTML = round(laina);
    document.getElementById("lainakulut").innerHTML = round(lainakulukk);
    //document.getElementById("kulu").innerHTML = round(kulu);
    document.getElementById("omistuspaaoma").innerHTML = round(omistuspaaoma) + " euroa";

    //document.getElementById("saasto").innerHTML = round(kksaasto);
    document.getElementById("vuokrapaaoma").innerHTML = round(vuokrapaaoma) + " euroa";

    // Loppulausunto
    vuokrapaaoma = round(vuokrapaaoma);
    omistuspaaoma = round(omistuspaaoma);
    if (vuokrapaaoma > omistuspaaoma) {
        var lausunto = "Annetuilla tiedoilla <b>vuokra-asunto</b> on ollut " + (vuokrapaaoma-omistuspaaoma) + " euroa kannattavampi laina-ajan loputtua.";
    }
    else if (vuokrapaaoma < omistuspaaoma) {
        var lausunto = "Annetuilla tiedoilla <b>omistusasunto</b> on ollut " + (omistuspaaoma-vuokrapaaoma) + " euroa kannattavampi laina-ajan loputtua.";
    }
    else {
        var lausunto = "Annetuilla tiedoilla vuokra-asunto ja omistusasunto ovat olleet yhtä kannattavia laina-ajan loputtua.";
    }
    document.getElementById("lausunto").innerHTML = lausunto;
    
}

function round(num) {
    // Pyöristä tasaeuroihin (tai muuta 1->100 niin pyöristää sentteihin)
    return Math.ceil(num*1) / 1
}

window.onload = update;
