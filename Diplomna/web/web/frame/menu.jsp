<%@ page contentType="text/html; charset=utf-8" %>
<!doctype html public "-//w3c//dtd html 4.0 transitional//en">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <% String frameURL = "http://" + request.getServerName().toString() + "/frame/"; %>
</head>
<body style="padding: 0px; margin: 0px; border: 0px;">
  <link href="<%=frameURL%>main.css" rel="stylesheet" type="text/css">
  <link href="<%=frameURL%>frame.css" rel="stylesheet" type="text/css">

    <table class="frame" style="height: 100%; width: 100%; background-image: url('<%=frameURL%>background-left-2.jpg'); background-repeat: repeat-y;">
      <tr>
        <td style="text-align: left; vertical-align: top; background-image: url('<%=frameURL%>background-left-1.jpg'); background-repeat: no-repeat;">
          <font style="font-size: 1pt;">
            <img class="tight" style="height: 0px; width: 200px;" alt="" />
          </font>
          <link rel="stylesheet" type="text/css" href="<%=frameURL%>menu.css">
          <script language="JavaScript" src="<%=frameURL%>menu.js"></script>
          <script language="JavaScript" src="<%=frameURL%>menu-nodes-bg-utf-8.js"></script>
          <script language="JavaScript" src="<%=frameURL%>menu-format.js"></script>
        </td>
      </tr>
    </table>

</body>