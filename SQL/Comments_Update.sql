USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Update]    Script Date: 6/15/2023 11:48:36 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Byungsu Lee
-- Create date: 05/06/2023
-- Description: Update Comments
-- Code Reviewer: Alejandro Espinosa

-- MODIFIED BY: Byungsu Lee
-- MODIFIED DATE: 05/10/2023
-- Code Reviewer: Christopher Pachay
-- Note: Deleted CreatedBy Parameter
-- =============================================




ALTER PROC [dbo].[Comments_Update]
			@Subject nvarchar(50) = Null
		   ,@Text nvarchar(3000)
		   ,@ParentId int = Null
		   ,@EntityTypeId int
		   ,@EntityId int 
		   ,@Id int 

/*
select *
from dbo.Comments

	Declare @Id int = 29
		   ,@Subject nvarchar(50) = 'Update subject05'
		   ,@Text nvarchar(3000) = 'Update text05'
		   ,@ParentId int = 100
		   ,@EntityTypeId int = 3
		   ,@EntityId int = 2
		  
		   

	Execute dbo.Comments_Update
			 @Subject
			,@Text
			,@ParentId
			,@EntityTypeId
			,@EntityId
			,@Id

Select * 
from dbo.Comments


*/

AS

BEGIN

	UPDATE [dbo].[Comments]

	   SET [Subject] = @Subject
		  ,[Text] = @Text
		  ,[ParentId] = @ParentId
		  ,[EntityTypeId] = @EntityTypeId
		  ,[EntityId] = @EntityId
		  ,[DateModified] = GETUTCDATE()
		

 		 
	WHERE Id = @Id

END