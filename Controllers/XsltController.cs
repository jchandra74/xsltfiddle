using System.Collections.Generic;
using System.Web.Http;
using XSLTFiddle.Services;

namespace XSLTFiddle.Controllers
{
    public class XsltController : ApiController
    {
        // GET: api/Xslt
        //public IEnumerable<string> Get()
        //{
        //    return new string[] { "value1", "value2" };
        //}

        //// GET: api/Xslt/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST: api/Xslt
        [HttpPost]
        public string Post(string xml, string xslt)
        {
            var result = XsltService.Transform(xml, xslt);
            return result;
        }

        //// PUT: api/XsltApi/5
        //public void Put(int id, [FromBody]string value)
        //{
        //}

        //// DELETE: api/XsltApi/5
        //public void Delete(int id)
        //{
        //}
    }
}
