USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Delete]    Script Date: 6/15/2023 11:49:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Byungsu Lee
-- Create date: 05/06/2023
-- Description: Delete Comments
-- Code Reviewer: Alejandro Espinosa

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================



ALTER PROC [dbo].[Comments_Delete]
		@Id int
	  

/*

select *
from dbo.Comments

Declare @Id int = 13
	   

Execute dbo.Comments_Delete
		@Id
	   

Select *
from dbo.Comments

*/

AS

BEGIN

	UPDATE dbo.Comments
	SET IsDeleted = 1
	WHERE Id = @Id

END