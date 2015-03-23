using System.IO;
using System.Text;
using System.Xml;
using System.Xml.XPath;
using System.Xml.Xsl;

namespace XSLTFiddle.Services
{
    public class XsltService
    {
        public static string Transform(string xml, string stylesheet)
        {
            var xsltSettings = new XsltSettings();
            xsltSettings.EnableDocumentFunction = true;
            xsltSettings.EnableScript = true;
            var xslt = new XslCompiledTransform(true);
            using (var reader = new XmlTextReader(new StringReader(stylesheet)))
            {
                xslt.Load(reader, xsltSettings, null);
            }

            XPathDocument doc;
            using (var reader = new XmlTextReader(new StringReader(xml)))
            {
                doc = new XPathDocument(reader);
            }

            var sb = new StringBuilder();
            using (var writer = new XmlTextWriter(new StringWriter(sb)))
            {
                writer.Formatting = Formatting.Indented;
                xslt.Transform(doc, null, writer, null);
            }

            return sb.ToString();
        }
    }
}