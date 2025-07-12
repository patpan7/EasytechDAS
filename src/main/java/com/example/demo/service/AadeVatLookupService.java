package com.example.demo.service;

import com.example.demo.dto.VatLookupResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.xpath.XPath;
import javax.xml.xpath.XPathConstants;
import javax.xml.xpath.XPathExpression;
import javax.xml.xpath.XPathFactory;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class AadeVatLookupService {

    @Value("${aade.username}")
    private String username;

    @Value("${aade.password}")
    private String password;

    public VatLookupResponse lookupAfm(String afm) {
        String url = "https://www1.gsis.gr/wsaade/RgWsPublic2/RgWsPublic2";
        String action = "POST";

        try {
            // Δημιουργία του SOAP αιτήματος
            String soapRequest = createSoapRequest(username, password, afm);

            // Ρύθμιση της σύνδεσης
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "application/soap+xml;charset=\"utf-8\"");
            connection.setRequestProperty("Accept", "application/xml");
            connection.setRequestProperty("SOAPAction", action);
            connection.setDoOutput(true);

            // Αποστολή του αιτήματος
            try (OutputStream outputStream = connection.getOutputStream()) {
                outputStream.write(soapRequest.getBytes("UTF-8"));
            }

            // Λήψη της απάντησης
            StringBuilder response = new StringBuilder();
            try (BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
                String inputLine;
                while ((inputLine = in.readLine()) != null) {
                    response.append(inputLine);
                }
            }

            // Επιστροφή της απάντησης ως κείμενο
            return parseResponse(response.toString());

        } catch (Exception e) {
            e.printStackTrace();
            // In a real app, throw a custom exception or return an error response
            return null;
        }
    }

    private VatLookupResponse parseResponse(String responseXml) throws Exception {
        // System.out.println(responseXml); // For debugging
        // Φόρτωση της XML από το response
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new ByteArrayInputStream(responseXml.getBytes()));

        // Δημιουργία XPath για αναζήτηση κόμβων
        XPathFactory xpathFactory = XPathFactory.newInstance();
        XPath xpath = xpathFactory.newXPath();

        // Εξαγωγή δεδομένων
        VatLookupResponse vatResponse = new VatLookupResponse();
        vatResponse.setAfm(getXPathValue(document, xpath, "//basic_rec/afm"));
        vatResponse.setEponimia(getXPathValue(document, xpath, "//basic_rec/onomasia"));
        vatResponse.setTitle(getXPathValue(document, xpath, "//basic_rec/commer_title"));
        String postalAddress = getXPathValue(document, xpath, "//basic_rec/postal_address");
        String postalAddressNo = getXPathValue(document, xpath, "//basic_rec/postal_address_no");
        vatResponse.setAddress(postalAddress + " " + postalAddressNo);
        vatResponse.setCity(getXPathValue(document, xpath, "//basic_rec/postal_area_description"));
        vatResponse.setZipCode(getXPathValue(document, xpath, "//basic_rec/postal_zip_code"));
        vatResponse.setProfession(getXPathValue(document, xpath, "//firm_act_tab/item/firm_act_descr"));
        vatResponse.setDoy(getXPathValue(document, xpath, "//basic_rec/doy_descr"));

        return vatResponse;
    }

    private String getXPathValue(Document document, XPath xpath, String expression) throws Exception {
        XPathExpression expr = xpath.compile(expression);
        Node node = (Node) expr.evaluate(document, XPathConstants.NODE);
        return node != null ? node.getTextContent() : "";
    }

    private String createSoapRequest(String username, String password, String afmToSearch) {
        return String.format("""
                <?xml version=\"1.0\" encoding=\"UTF-8\"?>
                <env:Envelope xmlns:env=\"http://www.w3.org/2003/05/soap-envelope\"
                              xmlns:ns2=\"http://rgwspublic2/RgWsPublic2Service\"
                              xmlns:ns3=\"http://rgwspublic2/RgWsPublic2\"
                              xmlns:ns1=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">
                    <env:Header>
                        <ns1:Security>
                            <ns1:UsernameToken>
                                <ns1:Username>%s</ns1:Username>
                                <ns1:Password>%s</ns1:Password>
                            </ns1:UsernameToken>
                        </ns1:Security>
                    </env:Header>
                    <env:Body>
                        <ns2:rgWsPublic2AfmMethod>
                            <ns2:INPUT_REC>
                                <ns3:afm_called_by/>
                                <ns3:afm_called_for>%s</ns3:afm_called_for>
                            </ns2:INPUT_REC>
                        </ns2:rgWsPublic2AfmMethod>
                    </env:Body>
                </env:Envelope>
                """, username, password, afmToSearch);
    }
}

