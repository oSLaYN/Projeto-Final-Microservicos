-- --------------------------------------------------------
-- Anfitrião:                    127.0.0.1
-- Versão do servidor:           10.11.11-MariaDB-ubu2204 - mariadb.org binary distribution
-- SO do servidor:               debian-linux-gnu
-- HeidiSQL Versão:              12.10.0.7000
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- A despejar estrutura da base de dados para users
DROP DATABASE IF EXISTS `users`;
CREATE DATABASE IF NOT EXISTS `users` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `users`;

-- A despejar estrutura para tabela users.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` longtext NOT NULL,
  `fullname` longtext NOT NULL,
  `password` longtext NOT NULL,
  `type` varchar(50) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- A despejar dados para tabela users.users: ~3 rows (aproximadamente)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `username`, `fullname`, `password`, `type`) VALUES
	(3, 'paiva', 'Rodrigo Paiva', '$2b$12$MhQrr/vphBXolq72jWhrkeCpbZsfLOvJXxlxuu8TJ7NlZvPZika6m', 'admin');
INSERT INTO `users` (`id`, `username`, `fullname`, `password`, `type`) VALUES
	(8, 'artur', 'Artur Faria', '$2b$12$hEdiAv1/a7JD.reVCuur0el9oUHMzkEmp93DltRiR33NXQ9dOMfJy', 'admin');
INSERT INTO `users` (`id`, `username`, `fullname`, `password`, `type`) VALUES
	(9, 'miguel', 'Miguel Santos', '$2b$12$.HWIT./v2YCV0BH17Lw2yOGhZssjpcND2JIzq31Vg2qkQnO/bILUO', 'admin');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
