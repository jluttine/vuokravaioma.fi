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
    
    var vuokra = document.getElementById('vuokra').value * 1.0;
    var tuotto = document.getElementById('tuotto').value / 100.0;

    // Laske omistusasumisen tunnusluvut
    if (hinta > paaoma) {
        var laina = hinta - paaoma;
        var omistuspaaoma = hinta;
    }
    else {
        var laina = 0.0;
        var omistuspaaoma = paaoma;
    }

    if (aika > 0) {
        var kasvukerroin = Math.pow(1+korko, aika)
        if (korko > 0)
            var annuiteetti = kasvukerroin * korko / (kasvukerroin - 1) * laina;
        else if (korko == 0)
            var annuiteetti = laina / aika;
    }
    else if (aika == 0) {
        var annuiteetti = laina;
    }

    var kulu = annuiteetti / 12.0 + vastike

    // Laske vuokralla asumisen tunnusluvut
    var kerroin = Math.pow(1+tuotto, aika);
    var kksaasto = kulu - vuokra;
    var saasto = 12 * kksaasto;
    if (kulu > vuokra) {
        var vuokrapaaoma = kerroin * paaoma + (kerroin - 1) / tuotto * saasto;
    }
    else {
        var vuokrapaaoma = kerroin * paaoma + saasto * aika;
    }

    // Näytä tunnusluvut
    document.getElementById("laina").innerHTML = round(laina);
    document.getElementById("annuiteetti").innerHTML = round(annuiteetti);
    document.getElementById("kulu").innerHTML = round(kulu);
    document.getElementById("omistuspaaoma").innerHTML = round(omistuspaaoma) + " euroa";

    document.getElementById("saasto").innerHTML = round(kksaasto);
    document.getElementById("vuokrapaaoma").innerHTML = round(vuokrapaaoma) + " euroa";

    // Loppulausunto
    vuokrapaaoma = round(vuokrapaaoma);
    omistuspaaoma = round(omistuspaaoma);
    if (vuokrapaaoma > omistuspaaoma) {
        var lausunto = "Annetuilla tiedoilla <b>vuokra-asunto</b> on " + (vuokrapaaoma-omistuspaaoma) + " euroa kannattavampi.";
    }
    else if (vuokrapaaoma < omistuspaaoma) {
        var lausunto = "Annetuilla tiedoilla <b>omistusasunto</b> on " + (omistuspaaoma-vuokrapaaoma) + " euroa kannattavampi.";
    }
    else {
        var lausunto = "Annetuilla tiedoilla vuokra-asunto ja omistusasunto ovat yhtä kannattavia.";
    }
    document.getElementById("lausunto").innerHTML = lausunto;
    
}

function round(num) {
    // Pyöristä tasaeuroihin (tai muuta 1->100 niin pyöristää sentteihin)
    return Math.ceil(num*1) / 1
}

window.onload = update;
