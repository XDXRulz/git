<%@ page import="bg.infologica.water.core.Header" %>
<%@ page import="bg.infologica.water.core.SessionMessages" %>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%

    String frameURL = "http://" + request.getServerName()
            + (request.getServerPort() != 80 ? ":" + request.getServerPort() : "") + "/frame/";
            //request.getContextPath() + "/frame/";

%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>ИАОС Води</title>
    <link rel="stylesheet" href="css/jquery.datePicker.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/jquery.decimalDegrees.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/style.css" type="text/css" media="all"/>
    <link rel="stylesheet" href="css/print.css" type="text/css" media="print"/>
    <link rel="stylesheet" href="css/smoothness/jquery-ui-1.9.0.custom.min.css" type="text/css" media="all"/>
    <script type="text/javascript" src="js/infologica.init.js"></script>
    <script type="text/javascript" src="js/jquery-1.9.1.min.js"></script>
    <script type="text/javascript" src="js/jquery.form-3.31.0-2013.03.22.js"></script>
    <script type="text/javascript" src="js/date.js"></script>
    <script type="text/javascript" src="js/date_bg.js"></script>
    <script type="text/javascript" src="js/jquery.datePicker.js"></script>
    <script type="text/javascript" src="js/jquery.decimalDegrees.js"></script>
    <script type="text/javascript" src="js/jquery.fixer.js"></script>
    <script type="text/javascript" src="js/overlib.js"></script>
    <script type="text/javascript" src="js/infologica.common.js"></script>
    <script type="text/javascript" src="js/infologica.inputs.js"></script>
    <script type="text/javascript" src="js/infologica.popups.js"></script>
</head>
<body>
<div id="main_body_div">
    <!-- Osnovna tablitsa -->
    <table style="width: 100%;" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td style="min-width: 3px; background-color: #C3D5E6">
                <div style="width: 3px;"></div>
            </td>
            <td style="width: 100%; vertical-align: top; padding: 0;">

                <!--============== Край на добавения код ==============-->

<div id="page_container"><div class="pcl"><div class="pcr">
<%
    Header header = new Header(session, request);
%>
    <div id="header" class="noprint"><%= header.get() %></div>
    <div id="page_content"><div id="content">
        <div class="main"><div class="inn">
<%= SessionMessages.get(session) %>
<%
    out.flush();
%>