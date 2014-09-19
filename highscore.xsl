<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
  <html>
  <body>
    <h2>Highscore</h2>
    <table border="1">
      <tr bgcolor="#9acd32">
        <th>Name</th>
        <th>Score</th>
      </tr>
      <xsl:for-each select="highscore/player">
	  <xsl:sort select="score" order="descending" data-type="number"/>
        <tr>
          <td><xsl:value-of select="name"/></td>
          <td><xsl:value-of select="score"/></td>
        </tr>
      </xsl:for-each>
    </table>
  </body>
  </html>
</xsl:template>

</xsl:stylesheet>