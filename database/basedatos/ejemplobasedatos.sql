-- MariaDB dump 10.17  Distrib 10.4.11-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: mydb
-- ------------------------------------------------------
-- Server version	10.4.11-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrera`
--

DROP TABLE IF EXISTS `carrera`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `carrera` (
  `idCarrera` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_carrera` varchar(45) DEFAULT NULL,
  `Descripcion_carrera` varchar(45) DEFAULT NULL,
  `Ciudad_idCiudad` int(11) NOT NULL,
  `Jornada_idJornada` int(11) NOT NULL,
  PRIMARY KEY (`idCarrera`,`Ciudad_idCiudad`,`Jornada_idJornada`),
  KEY `fk_Carrera_Ciudad1_idx` (`Ciudad_idCiudad`),
  KEY `fk_Carrera_Jornada1_idx` (`Jornada_idJornada`),
  CONSTRAINT `fk_Carrera_Ciudad1` FOREIGN KEY (`Ciudad_idCiudad`) REFERENCES `ciudad` (`idCiudad`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Carrera_Jornada1` FOREIGN KEY (`Jornada_idJornada`) REFERENCES `jornada` (`idJornada`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carrera`
--

LOCK TABLES `carrera` WRITE;
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
INSERT INTO `carrera` VALUES (1,'sistemas','ingenieria de sistemas y computacion',1,1);
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ciudad`
--

DROP TABLE IF EXISTS `ciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ciudad` (
  `idCiudad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_Ciudad` varchar(45) NOT NULL,
  PRIMARY KEY (`idCiudad`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ciudad`
--

LOCK TABLES `ciudad` WRITE;
/*!40000 ALTER TABLE `ciudad` DISABLE KEYS */;
INSERT INTO `ciudad` VALUES (1,'sogamoso');
/*!40000 ALTER TABLE `ciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenidocurso`
--

DROP TABLE IF EXISTS `contenidocurso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contenidocurso` (
  `Materia_idMateria` int(11) NOT NULL,
  `Usuario_Codigo` int(11) NOT NULL,
  `Codigo_Monitor` int(11) DEFAULT NULL,
  `Codigo_Docente` int(11) DEFAULT NULL,
  KEY `fk_Curso_Materia1_idx` (`Materia_idMateria`),
  KEY `fk_ContenidoCurso_Usuario1_idx` (`Usuario_Codigo`),
  CONSTRAINT `fk_ContenidoCurso_Usuario1` FOREIGN KEY (`Usuario_Codigo`) REFERENCES `usuario` (`Codigo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Curso_Materia1` FOREIGN KEY (`Materia_idMateria`) REFERENCES `materia` (`idMateria`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenidocurso`
--

LOCK TABLES `contenidocurso` WRITE;
/*!40000 ALTER TABLE `contenidocurso` DISABLE KEYS */;
INSERT INTO `contenidocurso` VALUES (2,258,NULL,NULL),(2,456,NULL,NULL),(2,789,NULL,NULL),(2,369,369,NULL);
/*!40000 ALTER TABLE `contenidocurso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `foro`
--

DROP TABLE IF EXISTS `foro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `foro` (
  `idForo` int(11) NOT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idForo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `foro`
--

LOCK TABLES `foro` WRITE;
/*!40000 ALTER TABLE `foro` DISABLE KEYS */;
/*!40000 ALTER TABLE `foro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jornada`
--

DROP TABLE IF EXISTS `jornada`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jornada` (
  `idJornada` int(11) NOT NULL AUTO_INCREMENT,
  `tipo_jornada` varchar(45) NOT NULL,
  PRIMARY KEY (`idJornada`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jornada`
--

LOCK TABLES `jornada` WRITE;
/*!40000 ALTER TABLE `jornada` DISABLE KEYS */;
INSERT INTO `jornada` VALUES (1,'diurna'),(2,'nocturna');
/*!40000 ALTER TABLE `jornada` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `materia`
--

DROP TABLE IF EXISTS `materia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `materia` (
  `idMateria` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_materia` varchar(45) NOT NULL,
  `Grupo_materia` varchar(45) NOT NULL,
  `Carrera_idCarrera` int(11) NOT NULL,
  PRIMARY KEY (`idMateria`,`Carrera_idCarrera`),
  KEY `fk_Materia_Carrera1_idx` (`Carrera_idCarrera`),
  CONSTRAINT `fk_Materia_Carrera1` FOREIGN KEY (`Carrera_idCarrera`) REFERENCES `carrera` (`idCarrera`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `materia`
--

LOCK TABLES `materia` WRITE;
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
INSERT INTO `materia` VALUES (2,'programacion','60-0',1),(3,'calculo','60-1',1);
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `relacion`
--

DROP TABLE IF EXISTS `relacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `relacion` (
  `Foro_idForo` int(11) NOT NULL,
  `Usuario_Codigo` int(11) NOT NULL,
  `Usuario_Carrera_idCarrera` int(11) NOT NULL,
  `Usuario_Tipo_idTipo` int(11) NOT NULL,
  `Mensaje` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Foro_idForo`,`Usuario_Codigo`,`Usuario_Carrera_idCarrera`,`Usuario_Tipo_idTipo`),
  KEY `fk_Relacion_Foro1_idx` (`Foro_idForo`),
  KEY `fk_Relacion_Usuario1_idx` (`Usuario_Codigo`,`Usuario_Carrera_idCarrera`,`Usuario_Tipo_idTipo`),
  CONSTRAINT `fk_Relacion_Foro1` FOREIGN KEY (`Foro_idForo`) REFERENCES `foro` (`idForo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_Relacion_Usuario1` FOREIGN KEY (`Usuario_Codigo`, `Usuario_Carrera_idCarrera`, `Usuario_Tipo_idTipo`) REFERENCES `usuario` (`Codigo`, `Carrera_idCarrera`, `Tipo_idTipo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `relacion`
--

LOCK TABLES `relacion` WRITE;
/*!40000 ALTER TABLE `relacion` DISABLE KEYS */;
/*!40000 ALTER TABLE `relacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('0Iec6_Ht5NpfcfSX6x85_LpuHxTqugsy',1598818656,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{},\"passport\":{\"user\":\"a-2016\"}}'),('u9Mjk44d41nMpagjYWF5aKtVH5GL01uV',1598810574,'{\"cookie\":{\"originalMaxAge\":null,\"expires\":null,\"httpOnly\":true,\"path\":\"/\"},\"flash\":{}}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `temas`
--

DROP TABLE IF EXISTS `temas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `temas` (
  `idTemas` int(11) NOT NULL,
  `Nombre` varchar(45) DEFAULT NULL,
  `Materia_idMateria` int(11) NOT NULL,
  PRIMARY KEY (`idTemas`,`Materia_idMateria`),
  KEY `fk_Temas_Materia1_idx` (`Materia_idMateria`),
  CONSTRAINT `fk_Temas_Materia1` FOREIGN KEY (`Materia_idMateria`) REFERENCES `materia` (`idMateria`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `temas`
--

LOCK TABLES `temas` WRITE;
/*!40000 ALTER TABLE `temas` DISABLE KEYS */;
/*!40000 ALTER TABLE `temas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo`
--

DROP TABLE IF EXISTS `tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipo` (
  `idTipo` int(11) NOT NULL AUTO_INCREMENT,
  `Nombre_tipo` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`idTipo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo`
--

LOCK TABLES `tipo` WRITE;
/*!40000 ALTER TABLE `tipo` DISABLE KEYS */;
INSERT INTO `tipo` VALUES (1,'estudiante'),(2,'docente'),(3,'monitor');
/*!40000 ALTER TABLE `tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario` (
  `Codigo` int(11) NOT NULL,
  `Nombre_usuario` varchar(45) DEFAULT NULL,
  `Correo_usuario` varchar(45) DEFAULT NULL,
  `Contrasena_usuario` varchar(60) DEFAULT NULL,
  `NombreUsuario_usuario` varchar(45) DEFAULT NULL,
  `Carrera_idCarrera` int(11) NOT NULL,
  `Tipo_idTipo` int(11) NOT NULL,
  PRIMARY KEY (`Codigo`,`Carrera_idCarrera`,`Tipo_idTipo`),
  KEY `fk_Usuario_Tipo1_idx` (`Tipo_idTipo`),
  CONSTRAINT `fk_Usuario_Tipo1` FOREIGN KEY (`Tipo_idTipo`) REFERENCES `tipo` (`idTipo`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (123,'daniel gomez','daniel.gomez07@uptc.edu.co','$2a$10$zzIZplpw3.Sp3S8phQMsTOKPnBGP4IvuQyZAes26szAQmUr5Z6mPC','daniel.gomez07',1,1),(147,'camilo sarmiento','camilo.sarmiento@uptc.edu.co','$2a$10$Y4yEM1BwVQ7l5bql7NBAHuChZxLSlfhtBxrzfcUL1EK7vmMPNxBky','camilo.sarmiento',1,1),(258,'natalia aponte','natalia.aponte@uptc.edu.co','$2a$10$F7..ruq2mMwlvHo3yd.bnuYemV3onssoh1tkfvuoQ3LPJifCzWpAu','natalia.aponte',1,1),(369,'karla guzman','karla.guzman@uptc.edu.co','$2a$10$TF.yPbVKSby4hBb0H49KBOeWpaYYE3KLurLORK39kHYYwrt8cNR5i','karla.guzman',1,3),(456,'juan gonzales','juan.gonzales@uptc.edu.co','$2a$10$/2SSULUz3xKb2LvjpKCXQuM8foKWaR75.Zk3zy2jbnWuVGWs5qvI.','juan.gonzales',1,1),(789,'esteban martinez','esteban.martinez@uptc.edu.co','$2a$10$yv.lh3MDxwDmdFA5L0L2UeexL4fIhlx4gwHo1o9bCKrbMbart4GyW','esteban.martinez',1,1),(7563,'carlos perez','carlos.perez@uptc.edu.co','$2a$10$ffvf4POu8t.AlJfS2K/iI.se0rixKpe6/X9zikzQ6lPu5I9U80Neq','carlos.perez',1,3),(9854625,'juan gonzales','juan.gonzales@uptc.edu.co','$2a$10$/QELE9EY21iJ26t4J8WMTu6euN8gWaYyDr.toAjlM03mChZGU1/GO','juan.gonzales',1,2);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_admin`
--

DROP TABLE IF EXISTS `usuario_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_admin` (
  `idUsuario_admin` varchar(20) NOT NULL,
  `Nombre_Usuario_admin` varchar(45) NOT NULL,
  `Contrasena_Usuario_admin` varchar(60) NOT NULL,
  `correo` varchar(45) NOT NULL,
  `tipo_usuario_admin` varchar(45) NOT NULL,
  `Carrera_idCarrera` int(11) NOT NULL,
  PRIMARY KEY (`idUsuario_admin`,`Carrera_idCarrera`),
  KEY `fk_Usuario_root_Carrera1_idx` (`Carrera_idCarrera`),
  CONSTRAINT `fk_Usuario_root_Carrera1` FOREIGN KEY (`Carrera_idCarrera`) REFERENCES `carrera` (`idCarrera`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_admin`
--

LOCK TABLES `usuario_admin` WRITE;
/*!40000 ALTER TABLE `usuario_admin` DISABLE KEYS */;
INSERT INTO `usuario_admin` VALUES ('a-2016','carlos.guzman','$2a$10$7uHxO7wVdIPBrvZlP3m90O6kqAM53nENuLnG6yGF669tyTHz2xHyy','carlos.guzman@uptc.edu.co','admin',1);
/*!40000 ALTER TABLE `usuario_admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario_root`
--

DROP TABLE IF EXISTS `usuario_root`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuario_root` (
  `idUsuario_root` varchar(10) NOT NULL,
  `nombre_usuario_root` varchar(45) NOT NULL,
  `contrasena_usuario_root` varchar(60) NOT NULL,
  `tipo_usuario_root` varchar(45) NOT NULL,
  PRIMARY KEY (`idUsuario_root`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario_root`
--

LOCK TABLES `usuario_root` WRITE;
/*!40000 ALTER TABLE `usuario_root` DISABLE KEYS */;
INSERT INTO `usuario_root` VALUES ('r-314pKA2a','dan','$2a$10$U2SbWOD84Y2rt7KWZk5fvO70CO6PK6RH5O3WNZEztE/WEMtqAt9JG','root');
/*!40000 ALTER TABLE `usuario_root` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-29 15:40:18
